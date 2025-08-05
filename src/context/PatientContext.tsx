import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Patient {
  id: string; // Changed from number to string for MongoDB ObjectId
  name: string;
  age: number;
  gender: string;
  conditions: string[];
  lastVisit: string;
  prescriptionCount: number;
}

interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'prescriptionCount'>) => Promise<void>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>; // Changed to string
  deletePatient: (id: string) => Promise<void>; // Changed to string
  incrementPrescriptionCount: (patientId: string) => Promise<void>; // Changed to string
  loading: boolean;
  error: string | null;
  generatePrescriptionNumber: (patientId: string) => Promise<string>; // Changed to string
}

const API_URL = 'http://localhost:3001/api';

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/patients`);
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      const data = await response.json();
      setPatients(data.map((patient: any) => ({
        id: patient._id || patient.id, // Handle MongoDB _id field
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        conditions: typeof patient.conditions === 'string' 
          ? patient.conditions.split(',').filter(Boolean)
          : patient.conditions,
        lastVisit: patient.lastVisit,
        prescriptionCount: patient.prescriptionCount || 0
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPatients();
  }, []);

  const addPatient = async (patient: Omit<Patient, 'id' | 'prescriptionCount'>) => {
    try {
      const response = await fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...patient,
          conditions: patient.conditions.join(','),
          prescriptionCount: 0
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add patient');
      }

      const newPatient = await response.json();
      setPatients(prevPatients => [...prevPatients, {
        ...newPatient,
        conditions: typeof newPatient.conditions === 'string' 
          ? newPatient.conditions.split(',').filter(Boolean)
          : newPatient.conditions
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updatePatient = async (id: string, updatedPatient: Partial<Patient>) => {
    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedPatient,
          conditions: updatedPatient.conditions?.join(',')
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update patient');
      }

      setPatients(patients.map(patient =>
        patient.id === id
          ? {
              ...patient,
              ...updatedPatient,
              conditions: updatedPatient.conditions || patient.conditions
            }
          : patient
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const deletePatient = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }

      setPatients(patients.filter(patient => patient.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const incrementPrescriptionCount = async (patientId: string) => {
    try {
      const response = await fetch(`${API_URL}/patients/${patientId}/increment-prescription`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to increment prescription count');
      }

      setPatients(patients.map(patient =>
        patient.id === patientId
          ? { ...patient, prescriptionCount: patient.prescriptionCount + 1 }
          : patient
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const generatePrescriptionNumber = async (patientId: string): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/prescriptions/generate-number/${patientId}`);
      if (!response.ok) {
        throw new Error('Failed to generate prescription number');
      }
      const data = await response.json();
      return data.prescriptionNumber;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to generate prescription number');
    }
  };

  return (
    <PatientContext.Provider value={{
      patients,
      addPatient,
      updatePatient,
      deletePatient,
      incrementPrescriptionCount,
      loading,
      error,
      generatePrescriptionNumber
    }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}; 