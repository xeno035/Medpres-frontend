import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePrescriptions } from '../context/PrescriptionContext';
import { usePrescriptionVerifications } from '../context/PrescriptionVerificationContext';
import { usePatients } from '../context/PatientContext';
import VerificationDetailsCard from '../components/VerificationDetailsCard';

const VerificationDetails: React.FC = () => {
  const { prescriptionNumber } = useParams();
  const navigate = useNavigate();
  const { getPrescriptionByNumber } = usePrescriptions();
  const { getVerificationsByPrescription } = usePrescriptionVerifications();
  const { patients } = usePatients();

  const [prescription, setPrescription] = useState<any>(null);
  const [verification, setVerification] = useState<any>(null);
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!prescriptionNumber) {
        setLoading(false);
        return;
      }
      const presc = await getPrescriptionByNumber(prescriptionNumber);
      setPrescription(presc);
      if (presc && presc.patientId) {
        const patient = patients.find((p) => p.id === presc.patientId);
        setPatientName(patient ? patient.name : '');
      }
      const verifications = await getVerificationsByPrescription(prescriptionNumber);
      setVerification(verifications && verifications.length > 0 ? verifications[0] : null);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, [prescriptionNumber, patients]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!prescription || !verification) {
    return (
      <div className="min-h-screen bg-gray-100 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">No Verification Details</h2>
            <p className="text-gray-600 mb-4">No verification details found.</p>
            <button
              onClick={() => navigate('/pharmacist/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare props for the card
  const prescriptionCard = {
    prescriptionNumber: prescriptionNumber || '',
    patientName: patientName,
    date: prescription.date,
    status: prescription.status,
    doctorName: prescription.doctorName,
    doctorSpecialization: prescription.doctorSpecialization,
    doctorLicense: prescription.doctorLicense,
    medications: prescription.medications,
    instructions: prescription.instructions,
  };
  const verificationCard = {
    verifiedBy: verification.verifiedBy,
    verificationDate: new Date(verification.verificationDate).toLocaleDateString(),
    status: verification.status === 'success' ? 'Verified' : verification.status,
    notes: verification.notes,
    pharmacyName: verification.pharmacyName,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/pharmacist/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <VerificationDetailsCard prescription={prescriptionCard} verification={verificationCard} />
          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => navigate('/pharmacist/verify-prescription')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Verify Another Prescription
            </button>
            <button
              onClick={() => navigate('/pharmacist/dashboard')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationDetails; 