import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { usePrescriptions } from '../context/PrescriptionContext';
import { FileText, Users, History, Plus, Search, User, LogOut, ArrowLeft, CheckCircle2 } from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { prescriptions } = usePrescriptions();
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Get recent prescriptions (last 5)
  const recentPrescriptions = useMemo(() => {
    return prescriptions.slice(0, 5);
  }, [prescriptions]);

  // Filter patients based on search term
  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;
    
    const searchLower = searchTerm.toLowerCase();
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(searchLower)
    );
  }, [patients, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleLogout = () => {
    navigate('/login');
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
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

        {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <button 
              onClick={() => navigate('/doctor/new-prescription')}
              className="flex items-center justify-center p-6 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-6 w-6 mr-2" />
              New Prescription
            </button>
            <button 
              onClick={() => navigate('/doctor/patient-records')}
              className="flex items-center justify-center p-6 bg-green-600 rounded-xl text-white hover:bg-green-700 transition-colors"
            >
              <Users className="h-6 w-6 mr-2" />
              Patient Records
            </button>
            <button 
              onClick={() => navigate('/doctor/prescription-history')}
              className="flex items-center justify-center p-6 bg-purple-600 rounded-xl text-white hover:bg-purple-700 transition-colors"
            >
              <History className="h-6 w-6 mr-2" />
              Prescription History
            </button>
            <button 
              onClick={() => navigate('/doctor/verified-prescriptions')}
              className="flex items-center justify-center p-6 bg-orange-600 rounded-xl text-white hover:bg-orange-700 transition-colors"
            >
              <CheckCircle2 className="h-6 w-6 mr-2" />
              Verified Prescriptions
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
            placeholder="Search patients..."
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

        {/* Patient List */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Patients</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prescriptions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      {searchTerm ? (
                        <div>
                          No patients found matching "{searchTerm}"
                          <button
                            onClick={clearSearch}
                            className="ml-2 text-blue-600 hover:text-blue-700"
                          >
                            Clear search
                          </button>
                        </div>
                      ) : (
                        'No patients found. Add a new patient to get started.'
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">{patient.name.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.age}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.gender}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.lastVisit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.prescriptionCount}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Prescriptions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                {recentPrescriptions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No recent prescriptions found. Create a new prescription to get started.
                    </td>
                  </tr>
                ) : (
                  recentPrescriptions.map((prescription) => {
                    const patient = patients.find(p => p.id === prescription.patientId);
                    return (
                      <tr key={prescription.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{patient?.name || 'Unknown Patient'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{prescription.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                      <button>View Details</button>
                    </td>
                  </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Total Patients</h3>
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
            <p className="text-sm text-gray-500">+{patients.length} this month</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Prescriptions</h3>
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            <p className="text-3xl font-bold text-gray-900">{prescriptions.length}</p>
            <p className="text-sm text-gray-500">+{prescriptions.length} this month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;