import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome!</h2>
        <p className="mb-8 text-gray-600">Please select your role to continue:</p>
        <div className="flex flex-col space-y-4">
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/doctor/login')}
          >
            Doctor Login
          </button>
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/pharmacist/login')}
          >
            Pharmacist Login
          </button>
        </div>
        <div className="mt-8 text-gray-500 text-sm">
          New user?{' '}
          <button
            className="text-blue-600 hover:underline font-medium"
            onClick={() => navigate('/doctor/register')}
          >
            Register as Doctor
          </button>
          {' '}or{' '}
          <button
            className="text-blue-600 hover:underline font-medium"
            onClick={() => navigate('/pharmacist/register')}
          >
            Register as Pharmacist
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection; 