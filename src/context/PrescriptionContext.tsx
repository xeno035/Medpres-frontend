import React, { createContext, useContext, useState, ReactNode } from 'react';
import { usePatients } from './PatientContext';

interface Prescription {
  id: string; // Changed from number to string for MongoDB ObjectId
  patientId: string; // Changed from number to string
  patientName: string;
  prescriptionNumber: string;
  date: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  instructions: string;
  doctorName: string;
  doctorLicense: string;
}

interface PrescriptionContextType {
  prescriptions: Prescription[];
  addPrescription: (prescription: Omit<Prescription, 'id'>) => Promise<void>;
  deletePrescription: (id: string) => Promise<void>; // Changed to string
  clearPrescriptions: () => void;
  loading: boolean;
  error: string | null;
  getPrescriptionByNumber: (prescriptionNumber: string) => Promise<Prescription | null>;
}

const API_URL = 'http://localhost:3001/api';

const PrescriptionContext = createContext<PrescriptionContextType | undefined>(undefined);

export const PrescriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { incrementPrescriptionCount } = usePatients();

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/prescriptions`);
      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions');
      }
      const data = await response.json();
      setPrescriptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getPrescriptionByNumber = async (prescriptionNumber: string): Promise<Prescription | null> => {
    try {
      const response = await fetch(`${API_URL}/prescriptions?prescriptionNumber=${encodeURIComponent(prescriptionNumber)}`);
      if (!response.ok) return null;
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) return data[0];
      return null;
    } catch {
      return null;
    }
  };

  React.useEffect(() => {
    fetchPrescriptions();
  }, []);

  const addPrescription = async (prescription: Omit<Prescription, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/prescriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prescription),
      });

      if (!response.ok) {
        throw new Error('Failed to add prescription');
      }

      const newPrescription = await response.json();
      setPrescriptions(prevPrescriptions => [...prevPrescriptions, newPrescription]);
      
      // Increment the prescription count for the patient
      await incrementPrescriptionCount(prescription.patientId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deletePrescription = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/prescriptions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete prescription');
      }

      setPrescriptions(prevPrescriptions => 
        prevPrescriptions.filter(prescription => prescription.id !== id)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const clearPrescriptions = () => {
    setPrescriptions([]);
  };

  return (
    <PrescriptionContext.Provider value={{
      prescriptions,
      addPrescription,
      deletePrescription,
      clearPrescriptions,
      loading,
      error,
      getPrescriptionByNumber,
    }}>
      {children}
    </PrescriptionContext.Provider>
  );
};

export const usePrescriptions = () => {
  const context = useContext(PrescriptionContext);
  if (context === undefined) {
    throw new Error('usePrescriptions must be used within a PrescriptionProvider');
  }
  return context;
}; 