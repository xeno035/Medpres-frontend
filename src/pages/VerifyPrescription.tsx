import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrescriptions } from '../context/PrescriptionContext';
import { usePatients } from '../context/PatientContext';
import { usePrescriptionVerifications } from '../context/PrescriptionVerificationContext';
import { ArrowLeft, Search, CheckCircle2, AlertCircle, FileText, User, Calendar, Clock } from 'lucide-react';
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
      if (prescription.status === 'completed') {
        // Add new verification record
        await addVerification({
          prescriptionNumber,
          verifiedBy: 'Pharmacist', // In a real app, this would be the logged-in pharmacist's name
          verificationDate: new Date().toISOString(),
          status: 'success',
          notes: 'Prescription verified successfully'
        });
        toast.success('Prescription verified successfully!');
        // Refresh verification history after adding
        const updatedHistory = await getVerificationsByPrescription(prescriptionNumber);
        setVerificationHistory(updatedHistory);
      } else {
        toast.error('Prescription not yet completed by doctor');
      }
    } else {
      setFoundPrescription(null);
      setPatientName('');
      setVerificationHistory([]);
      toast.error('Prescription not found');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Prescription Details</h2>
                {foundPrescription.status === 'completed' ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Verified {verificationHistory.length} times</span>
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-600">
                    <AlertCircle className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Not verified by doctor</span>
                  </div>
                )}
              </div>

              {/* Patient Information */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-3">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-800">Patient Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-800">{patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prescription Number</p>
                    <p className="text-gray-800">{foundPrescription.prescriptionNumber}</p>
                  </div>
                </div>
              </div>

              {/* Prescription Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-3">
                  <FileText className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-800">Prescription Details</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-800">{new Date(foundPrescription.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Medications</p>
                    <div className="mt-2 p-3 bg-white rounded-lg">
                      {Array.isArray(foundPrescription.medications)
                        ? foundPrescription.medications.map((med, idx) => (
                            <div key={idx}>
                              {med.name} - {med.dosage} ({med.frequency}) for {med.duration}
                            </div>
                          ))
                        : <p className="text-gray-800 whitespace-pre-wrap">{String(foundPrescription.medications)}</p>}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Instructions</p>
                    <div className="mt-2 p-3 bg-white rounded-lg">
                      <p className="text-gray-800 whitespace-pre-wrap">{foundPrescription.instructions}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification History */}
              {verificationHistory.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Clock className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-800">Verification History</h3>
                  </div>
                  <div className="space-y-3">
                    {verificationHistory.map((verification) => (
                      <div key={verification.id} className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">
                              Verified by: {verification.verifiedBy}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(verification.verificationDate).toLocaleString()}
                          </span>
                        </div>
                        {verification.notes && (
                          <p className="text-sm text-gray-600 mt-2">{verification.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPrescription;
