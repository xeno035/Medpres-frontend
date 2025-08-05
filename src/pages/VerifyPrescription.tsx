import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrescriptions } from '../context/PrescriptionContext';
import { usePatients } from '../context/PatientContext';
import { usePrescriptionVerifications } from '../context/PrescriptionVerificationContext';
import { ArrowLeft, Search, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyPrescription: React.FC = () => {
  const navigate = useNavigate();
  const { prescriptions } = usePrescriptions();
  const { patients } = usePatients();
  const { addVerification, getVerificationsByPrescription } = usePrescriptionVerifications();
  const [prescriptionNumber, setPrescriptionNumber] = useState('');
  const [foundPrescription, setFoundPrescription] = useState<any>(null);
  const [patientName, setPatientName] = useState<string>('');
  const [verificationHistory, setVerificationHistory] = useState<any[]>([]);

  const handleSearch = async () => {
    const prescription = prescriptions.find(p => p.prescriptionNumber === prescriptionNumber);
    if (prescription) {
      setFoundPrescription(prescription);
      // Find the patient name using the patientId from the prescription
      const patient = patients.find(p => p.id === prescription.patientId);
      if (patient) {
        setPatientName(patient.name);
      }
      // Get verification history for this prescription
      const history = await getVerificationsByPrescription(prescriptionNumber);
      setVerificationHistory(history);
    } else {
      setFoundPrescription(null);
      setPatientName('');
      setVerificationHistory([]);
      toast.error('Prescription not found');
    }
  };

  const handleVerifyPrescription = async () => {
    const currentPharmacist = localStorage.getItem('pharmacist');
    if (!currentPharmacist) {
      toast.error('Please log in as a pharmacist');
      return;
    }

    if (!foundPrescription) {
      toast.error('Please search for a prescription first');
      return;
    }

    try {
      // Add verification record with pharmacist details
      await addVerification({
        prescriptionNumber,
        verifiedBy: JSON.parse(currentPharmacist).name,
        pharmacistId: JSON.parse(currentPharmacist).id,
        doctorId: foundPrescription.doctorId,
        verificationDate: new Date().toISOString(),
        status: 'verified',
        notes: 'Prescription verified successfully'
      });

      toast.success('Prescription verified successfully!');
      
      // Navigate to verification details page
      navigate(`/pharmacist/verification-details/${prescriptionNumber}`);
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify prescription');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <button
                onClick={() => navigate('/pharmacist/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <Home className="h-5 w-5 mr-2" />
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Verify Prescription</h1>
          
          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={prescriptionNumber}
                  onChange={(e) => setPrescriptionNumber(e.target.value)}
                  placeholder="Enter prescription number..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
            </div>
          </div>

          {/* Prescription Details */}
          {foundPrescription && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Prescription Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="font-medium">Prescription #: {foundPrescription.prescriptionNumber}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <span>Patient: {patientName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <span>Date: {foundPrescription.date}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-green-600">Status: {foundPrescription.status}</span>
                </div>
              </div>

              {/* Medications */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Medications</h3>
                <div className="space-y-2">
                  {Array.isArray(foundPrescription.medications) ? 
                    foundPrescription.medications.map((med: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium">{med.name}</div>
                        <div className="text-sm text-gray-600">
                          Dosage: {med.dosage} | Frequency: {med.frequency}
                        </div>
                      </div>
                    )) : 
                    <div className="text-gray-500">No medications listed</div>
                  }
                </div>
              </div>

              {/* Verify Button */}
              <div className="mt-6">
                <button
                  onClick={handleVerifyPrescription}
                  className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Verify Prescription
                </button>
              </div>
            </div>
          )}

          {/* Verification History */}
          {verificationHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Verification History</h2>
              <div className="space-y-3">
                {verificationHistory.map((verification, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Verified by: {verification.verifiedBy}</div>
                        <div className="text-sm text-gray-600">
                          Date: {new Date(verification.verificationDate).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {verification.status}
                      </span>
                    </div>
                    {verification.notes && (
                      <div className="text-sm text-gray-600 mt-1">{verification.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPrescription;
