import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle2, User, Calendar, FileText, Building } from 'lucide-react';
import toast from 'react-hot-toast';

interface VerifiedPrescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  doctorId: string;
  date: string;
  medications: any[];
  instructions: string;
  status: string;
  verification: {
    verifiedBy: string;
    pharmacistId: string;
    verificationDate: string;
    status: string;
    notes: string;
  };
}

const VerifiedPrescriptions: React.FC = () => {
  const navigate = useNavigate();
  const [verifiedPrescriptions, setVerifiedPrescriptions] = useState<VerifiedPrescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Get current doctor's ID from localStorage
  const getCurrentDoctorId = (): string | null => {
    const doctorData = localStorage.getItem('doctor');
    if (doctorData) {
      const doctor = JSON.parse(doctorData);
      return doctor.id;
    }
    return null;
  };

  // Fetch verified prescriptions for the current doctor
  const fetchVerifiedPrescriptions = async () => {
    const doctorId = getCurrentDoctorId();
    if (!doctorId) {
      toast.error('Please log in as a doctor');
      navigate('/doctor/login');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/prescriptions/doctor/${doctorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions');
      }
      const prescriptions = await response.json();
      
      // Filter prescriptions that have verifications
      const verifiedPrescriptions = [];
      for (const prescription of prescriptions) {
        const verificationResponse = await fetch(`http://localhost:3001/api/verifications?prescriptionNumber=${prescription.prescriptionNumber}`);
        if (verificationResponse.ok) {
          const verifications = await verificationResponse.json();
          if (verifications.length > 0) {
            verifiedPrescriptions.push({
              ...prescription,
              verification: verifications[0] // Get the first verification
            });
          }
        }
      }
      
      setVerifiedPrescriptions(verifiedPrescriptions);
    } catch (error) {
      console.error('Error fetching verified prescriptions:', error);
      toast.error('Failed to load verified prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedPrescriptions();
  }, []);

  const filteredPrescriptions = verifiedPrescriptions.filter(prescription =>
    prescription.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.verification.verifiedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verified prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/doctor/dashboard')}
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
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">Verified Prescriptions</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search prescriptions..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-500">
                {filteredPrescriptions.length} of {verifiedPrescriptions.length}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prescription #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrescriptions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      {searchTerm ? (
                        <div>
                          No verified prescriptions found matching "{searchTerm}"
                        </div>
                      ) : (
                        'No verified prescriptions found. Prescriptions will appear here once they are verified by pharmacists.'
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <tr key={prescription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-blue-600">
                            {prescription.prescriptionNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prescription.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {prescription.verification.verifiedBy}
                            </div>
                            <div className="text-sm text-gray-500">
                              Pharmacist
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(prescription.verification.verificationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Verified
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => navigate(`/pharmacist/verification-details/${prescription.prescriptionNumber}`)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedPrescriptions; 