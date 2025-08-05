// Updated PatientRecords.tsx with functional "Add Patient" logic and modal open from navigation

import React, { useState, useEffect } from 'react';
import { Search, User, Calendar, FileText, Plus, X, ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { usePatients } from '../context/PatientContext';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface NewPatientForm {
  name: string;
  age: number;
  gender: string;
  conditions: string;
}

const PatientRecords: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState<NewPatientForm>({
    name: '',
    age: 0,
    gender: '',
    conditions: ''
  });

  const { patients, addPatient, deletePatient, loading, error } = usePatients();

  useEffect(() => {
    if (location.state?.openAddModal) {
      setShowModal(true);
    }
  }, [location]);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPatient({
        name: newPatient.name,
        age: newPatient.age,
        gender: newPatient.gender,
        lastVisit: new Date().toISOString().split('T')[0],
        conditions: newPatient.conditions.split(',').map(cond => cond.trim()).filter(Boolean)
      });

      setShowModal(false);
      setNewPatient({ name: '', age: 0, gender: '', conditions: '' });
      toast.success('Patient added successfully');
    } catch {
      toast.error('Failed to add patient');
    }
  };

  const handleDeletePatient = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}'s record?`)) {
      try {
        await deletePatient(id);
        toast.success('Patient record deleted');
      } catch {
        toast.error('Failed to delete record');
      }
    }
  };

  const filtered = patients.filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="mt-2 text-gray-600">Loading patient records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-16 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <p className="text-red-600">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-800">
                <ArrowLeft className="h-5 w-5 mr-1" /> Back
              </button>
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-800">Patient Records</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" /> Add Patient
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age/Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prescriptions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conditions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No patients found. Click "Add Patient" to create a new patient record.
                    </td>
                  </tr>
                ) : (
                  filtered.map(patient => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-10 w-10 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.age} years</div>
                        <div className="text-sm text-gray-500">{patient.gender}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2 inline" />
                        <span className="text-sm text-gray-900">{patient.lastVisit}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <FileText className="h-4 w-4 text-gray-400 mr-2 inline" />
                        <span className="text-sm text-gray-900">{patient.prescriptionCount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {patient.conditions.map((condition, i) => (
                            <span key={i} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {condition}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => handleDeletePatient(patient.id, patient.name)} title="Delete">
                          <Trash2 className="h-5 w-5 text-red-600 hover:text-red-800" />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Patient</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={newPatient.name} onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input type="number" required min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={newPatient.age} onChange={(e) => setNewPatient({ ...newPatient, age: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={newPatient.gender} onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                <input type="text" placeholder="Comma-separated values"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={newPatient.conditions} onChange={(e) => setNewPatient({ ...newPatient, conditions: e.target.value })} />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
