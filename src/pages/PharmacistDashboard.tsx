// PharmacistDashboard.tsx
import React, { useState } from 'react';
import {
  ClipboardCheck, PackageSearch, History, Search, FileText, LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePrescriptions } from '../context/PrescriptionContext';

const PharmacistDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { prescriptions } = usePrescriptions();
  const [showDetails, setShowDetails] = useState<number | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const successfulPrescriptions = prescriptions.filter(p => p.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">MedPress</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Pharmacist Dashboard</h1>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/verify-prescription')}
            className="flex items-center justify-center p-6 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition"
          >
            <ClipboardCheck className="h-6 w-6 mr-2" />
            Verify Prescription
          </button>
          <button
            onClick={() => navigate('/inventory')}
            className="flex items-center justify-center p-6 bg-green-600 rounded-xl text-white hover:bg-green-700 transition"
          >
            <PackageSearch className="h-6 w-6 mr-2" />
            Inventory Management
          </button>
          <button
            onClick={() => navigate('/prescription-history')}
            className="flex items-center justify-center p-6 bg-purple-600 rounded-xl text-white hover:bg-purple-700 transition"
          >
            <History className="h-6 w-6 mr-2" />
            Dispensing History
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search prescriptions or medications..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Successful Prescriptions */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Successful Prescriptions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {successfulPrescriptions.map((p) => (
              <div
                key={p.id}
                className="bg-green-50 p-4 rounded-lg shadow hover:bg-green-100 cursor-pointer"
                onClick={() => setShowDetails(p.id)}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-green-800">{p.patientName}</h3>
                    <p className="text-sm text-green-600">#{p.prescriptionNumber}</p>
                    <p className="text-sm text-green-600">{new Date(p.date).toLocaleDateString()}</p>
                  </div>
                  <ClipboardCheck className="h-5 w-5 text-green-600" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prescription Modal */}
        {showDetails !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Prescription Details</h2>
                <button
                  onClick={() => setShowDetails(null)}
                  className="text-2xl text-gray-500 hover:text-gray-800"
                >
                  ×
                </button>
              </div>
              {prescriptions.find(p => p.id === showDetails) && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Patient Name</h3>
                    <p className="text-gray-600">{prescriptions.find(p => p.id === showDetails)?.patientName}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Prescription Number</h3>
                    <p className="text-gray-600">{prescriptions.find(p => p.id === showDetails)?.prescriptionNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Date</h3>
                    <p className="text-gray-600">{new Date(prescriptions.find(p => p.id === showDetails)?.date || '').toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Medications</h3>
                    <div className="space-y-2">
                      {prescriptions.find(p => p.id === showDetails)?.medications.map((med, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                          <div className="font-medium">{med.name}</div>
                          <div className="text-sm text-gray-600">{med.dosage} - {med.frequency} for {med.duration}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Instructions</h3>
                    <p className="text-gray-600">{prescriptions.find(p => p.id === showDetails)?.instructions}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Doctor</h3>
                    <p className="text-gray-600">
                      Dr. {prescriptions.find(p => p.id === showDetails)?.doctorName}
                      {' '}({prescriptions.find(p => p.id === showDetails)?.doctorLicense})
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <ClipboardCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">Today's Verifications</h2>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <PackageSearch className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">Total Medications</h2>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
          </div>

          
        </section>
      </main>
    </div>
  );
};

export default PharmacistDashboard;
