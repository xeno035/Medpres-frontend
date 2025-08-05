        import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ClipboardCheck, FileText, Users } from 'lucide-react';

const Home: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-white">
    {/* Hero Section */}
    <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-8">
      <div className="bg-white border border-blue-100 shadow-lg rounded-2xl p-10 max-w-2xl w-full mx-auto">
        <div className="flex flex-col items-center mb-6">
          <HeartPulse className="h-14 w-14 text-blue-600 mb-2" />
          <h1 className="text-4xl font-extrabold text-blue-800 mb-2 tracking-tight">MedPress</h1>
          <p className="text-lg text-blue-900 font-semibold mb-2 italic">Empowering Digital Healthcare</p>
          <p className="text-base text-gray-700 mb-4 max-w-lg">
            MedPress is a secure, modern platform for digital prescription management. Designed for doctors, pharmacists, and patients to create, verify, and manage prescriptions with confidence and ease.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col items-center">
            <span className="bg-blue-50 p-4 rounded-full mb-2">
              <ClipboardCheck className="h-8 w-8 text-blue-500" />
            </span>
            <span className="font-semibold text-blue-800">Easy Verification</span>
            <span className="text-sm text-gray-600 text-center">Quickly verify and track prescriptions in real time.</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="bg-green-50 p-4 rounded-full mb-2">
              <FileText className="h-8 w-8 text-green-500" />
            </span>
            <span className="font-semibold text-green-800">Paperless Records</span>
            <span className="text-sm text-gray-600 text-center">Access and manage patient and prescription records securely.</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="bg-purple-50 p-4 rounded-full mb-2">
              <Users className="h-8 w-8 text-purple-500" />
            </span>
            <span className="font-semibold text-purple-800">Collaboration</span>
            <span className="text-sm text-gray-600 text-center">Connect doctors, pharmacists, and patients seamlessly.</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
          <Link
            to="/doctor/login"
            className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
          >
            Doctor Login
          </Link>
          <Link
            to="/doctor/register"
            className="bg-blue-50 text-blue-800 py-3 px-8 rounded-lg font-semibold shadow hover:bg-blue-100 transition-colors"
          >
            Doctor Register
          </Link>
          <Link
            to="/pharmacist/login"
            className="bg-green-600 text-white py-3 px-8 rounded-lg font-semibold shadow hover:bg-green-700 transition-colors"
          >
            Pharmacist Login
          </Link>
          <Link
            to="/pharmacist/register"
            className="bg-green-50 text-green-800 py-3 px-8 rounded-lg font-semibold shadow hover:bg-green-100 transition-colors"
          >
            Pharmacist Register
          </Link>
        </div>
      </div>
    </section>
    {/* Footer */}
    <footer className="text-center text-gray-500 py-4 text-sm border-t bg-white">
      &copy; {new Date().getFullYear()} MedPress. All rights reserved.
    </footer>
  </div>
);

export default Home;