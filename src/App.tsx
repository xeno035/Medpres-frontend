import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import DoctorLogin from './pages/DoctorLogin';
import DoctorRegister from './pages/DoctorRegister';
import DoctorDashboard from './pages/DoctorDashboard';
import NewPrescription from './pages/NewPrescription';
import PatientRecords from './pages/PatientRecords';
import PrescriptionHistory from './pages/PrescriptionHistory';
import PharmacistLogin from './pages/PharmacistLogin';
import PharmacistRegister from './pages/PharmacistRegister';
import PharmacistDashboard from './pages/PharmacistDashboard';
import { PrescriptionProvider } from './context/PrescriptionContext';
import { PatientProvider } from './context/PatientContext';
import VerifyPrescription from './pages/VerifyPrescription';
import { PrescriptionVerificationProvider } from './context/PrescriptionVerificationContext';
import InventoryManagement from './pages/InventoryManagement';
import DispensingHistory from './pages/DispensingHistory'; // adjust path as needed




function App() {
  return (
    <PatientProvider>
      <PrescriptionProvider>
        <PrescriptionVerificationProvider>
          <Router>
            <div className="min-h-screen bg-white">
              {/* Navigation */}
              <nav className="fixed w-full bg-white shadow-md z-50">
                <div className="container mx-auto px-6 py-4">
                  <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center">
                      <HeartPulse className="h-8 w-8 text-blue-600" />
                      <span className="ml-2 text-xl font-bold text-gray-800">MedPress</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                      <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
                      <div className="relative group">
                        <button className="text-gray-600 hover:text-blue-600">Doctors</button>
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <Link to="/doctor/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Login</Link>
                          <Link to="/doctor/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Register</Link>
                          <Link to="/doctor/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Dashboard</Link>
                        </div>
                      </div>
                      <div className="relative group">
                        <button className="text-gray-600 hover:text-blue-600">Pharmacists</button>
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <Link to="/pharmacist/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Login</Link>
                          <Link to="/pharmacist/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Register</Link>
                          <Link to="/pharmacist/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Dashboard</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/doctor/login" element={<DoctorLogin />} />
                <Route path="/doctor/register" element={<DoctorRegister />} />
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/new-prescription" element={<NewPrescription />} />
                <Route path="/doctor/patient-records" element={<PatientRecords />} />
                <Route path="/doctor/prescription-history" element={<PrescriptionHistory />} />
                <Route path="/pharmacist/login" element={<PharmacistLogin />} />
                <Route path="/pharmacist/register" element={<PharmacistRegister />} />
                <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
                <Route path="/verify-prescription" element={<VerifyPrescription />} />
                <Route path="/inventory" element={<InventoryManagement />} />
                <Route path="/" element={<Navigate to="/doctor-dashboard" replace />} />
                <Route path="/prescription-history" element={<DispensingHistory />} />
              </Routes>
            </div>
            <Toaster position="top-right" />
          </Router>
        </PrescriptionVerificationProvider>
      </PrescriptionProvider>
    </PatientProvider>
  );
}

export default App;