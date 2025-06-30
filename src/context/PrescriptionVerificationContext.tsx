import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface Verification {
  id: number;
  prescriptionNumber: string;
  verifiedBy: string; // Pharmacist name or ID
  verificationDate: string;
  status: 'success' | 'failed';
  notes?: string;
}

interface PrescriptionVerificationContextType {
  verifications: Verification[];
  addVerification: (verification: Omit<Verification, 'id'>) => Promise<void>;
  getVerificationsByPrescription: (prescriptionNumber: string) => Promise<Verification[]>;
  getVerificationCount: (prescriptionNumber: string) => Promise<number>;
  clearVerifications: () => Promise<void>;
  fetchAllVerifications: () => Promise<void>;
}

const API_URL = 'http://localhost:3001/api';

const PrescriptionVerificationContext = createContext<PrescriptionVerificationContextType | undefined>(undefined);

export const PrescriptionVerificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [verifications, setVerifications] = useState<Verification[]>([]);

  // Fetch all verifications from backend
  const fetchAllVerifications = useCallback(async () => {
    const res = await fetch(`${API_URL}/verifications`);
    const data = await res.json();
    setVerifications(data);
  }, []);

  // Add a verification to backend
  const addVerification = async (verification: Omit<Verification, 'id'>) => {
    const res = await fetch(`${API_URL}/verifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verification),
    });
    if (!res.ok) throw new Error('Failed to add verification');
    const newVerification = await res.json();
    setVerifications(prev => [...prev, newVerification]);
  };

  // Get verifications for a prescription from backend
  const getVerificationsByPrescription = async (prescriptionNumber: string) => {
    const res = await fetch(`${API_URL}/verifications?prescriptionNumber=${encodeURIComponent(prescriptionNumber)}`);
    if (!res.ok) return [];
    return await res.json();
  };

  // Get verification count for a prescription from backend
  const getVerificationCount = async (prescriptionNumber: string) => {
    const verifications = await getVerificationsByPrescription(prescriptionNumber);
    return verifications.filter(v => v.status === 'success').length;
  };

  // Clear all verifications (for admin/testing)
  const clearVerifications = async () => {
    // Not implemented in backend, so just clear local state
    setVerifications([]);
  };

  // Optionally, fetch all verifications on mount
  React.useEffect(() => {
    fetchAllVerifications();
  }, [fetchAllVerifications]);

  return (
    <PrescriptionVerificationContext.Provider value={{
      verifications,
      addVerification,
      getVerificationsByPrescription,
      getVerificationCount,
      clearVerifications,
      fetchAllVerifications
    }}>
      {children}
    </PrescriptionVerificationContext.Provider>
  );
};

export const usePrescriptionVerifications = () => {
  const context = useContext(PrescriptionVerificationContext);
  if (context === undefined) {
    throw new Error('usePrescriptionVerifications must be used within a PrescriptionVerificationProvider');
  }
  return context;
}; 