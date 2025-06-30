import React, { useState, useMemo } from 'react';
import { Search, FileText, Calendar, User, X, Filter, Trash2, Copy, ArrowLeft } from 'lucide-react';
import { usePrescriptions } from '../context/PrescriptionContext';
import { usePatients } from '../context/PatientContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PrescriptionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { prescriptions, clearPrescriptions } = usePrescriptions();
  const { patients } = usePatients();

  // Use useMemo to optimize the filtering
  const filteredPrescriptions = useMemo(() => {
    if (!searchTerm.trim()) return prescriptions;
    
    const searchLower = searchTerm.toLowerCase();
    return prescriptions.filter(prescription => {
      const patient = patients.find(p => p.id === prescription.patientId);
      return (
        patient?.name.toLowerCase().includes(searchLower) ||
        prescription.medications.some(med => med.name.toLowerCase().includes(searchLower)) ||
        prescription.prescriptionNumber?.toLowerCase().includes(searchLower)
      );
    });
  }, [prescriptions, patients, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleClearHistory = () => {
    clearPrescriptions();
    setShowClearConfirm(false);
    toast.success('Prescription history cleared successfully');
  };

  const copyPrescriptionNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast.success('Prescription number copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-800">Prescription History</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by patient name or medication..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Filter className="h-4 w-4 mr-1" />
                {filteredPrescriptions.length} of {prescriptions.length}
              </div>
              {prescriptions.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Clear History
                </button>
              )}
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
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrescriptions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      {searchTerm ? (
                        <div>
                          No prescriptions found matching "{searchTerm}"
                          <button
                            onClick={clearSearch}
                            className="ml-2 text-blue-600 hover:text-blue-700"
                          >
                            Clear search
                          </button>
                        </div>
                      ) : (
                        'No prescriptions found. Create a new prescription to get started.'
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredPrescriptions.map((prescription) => {
                    const patient = patients.find(p => p.id === prescription.patientId);
                    return (
                      <tr key={prescription.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-blue-600">
                              {prescription.prescriptionNumber}
                            </span>
                            <button
                              onClick={() => copyPrescriptionNumber(prescription.prescriptionNumber)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Copy prescription number"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {patient?.name || 'Unknown Patient'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {prescription.date}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {Array.isArray(prescription.medications) ? prescription.medications.map((med, index) => (
                              <div key={index} className="mb-1">
                                {med.name} - {med.dosage} ({med.frequency}) for {med.duration}
                              </div>
                            )) : <div>{String(prescription.medications)}</div>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {prescription.instructions}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Prescription Details Modal */}
          {showDetails !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Prescription Details</h2>
                  <button
                    onClick={() => setShowDetails(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                {prescriptions.find(p => p.id === showDetails) && (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-lg font-medium">
                        {patients.find(p => p.id === prescriptions.find(p => p.id === showDetails)?.patientId)?.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        {prescriptions.find(p => p.id === showDetails)?.date}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Medications</h3>
                      <div className="space-y-2">
                        {Array.isArray(prescriptions.find(p => p.id === showDetails)?.medications) ? 
                          prescriptions.find(p => p.id === showDetails)?.medications.map((med, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <div className="font-medium">
                                {med.name} - {med.dosage} ({med.frequency}) for {med.duration}
                              </div>
                            </div>
                          )) : <div>{String(prescriptions.find(p => p.id === showDetails)?.medications)}</div>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clear History Confirmation Modal */}
          {showClearConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Clear History</h2>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to clear all prescription history? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Clear History
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionHistory;
