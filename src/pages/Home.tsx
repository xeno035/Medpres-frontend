import React from 'react';
import { 
  Stethoscope, 
  Pill, 
  FileText, 
  History, 
  ClipboardCheck, 
  PackageSearch,
  Users,
  Clock,
  Shield,
  Laptop,
  MessageSquareText
} from 'lucide-react';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Digital Prescription Management System
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Streamline your healthcare workflow with our comprehensive digital prescription solution.
            Connecting doctors, pharmacists, and patients seamlessly.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">
              Get Started
            </button>
            
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Doctor's Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <Stethoscope className="h-10 w-10 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-800 ml-4">For Doctors</h3>
              </div>
              <p className="text-gray-600 mb-8">
                Streamline your prescription workflow and manage patient records efficiently.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-gray-800">Create Prescriptions</h4>
                  <p className="text-sm text-gray-600">Digital prescription creation with templates</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <History className="h-6 w-6 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-gray-800">Patient History</h4>
                  <p className="text-sm text-gray-600">Track complete medical history</p>
                </div>
              </div>
            </div>

            {/* Pharmacist's Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <Pill className="h-10 w-10 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-800 ml-4">For Pharmacists</h3>
              </div>
              <p className="text-gray-600 mb-8">
                Verify prescriptions instantly and manage your inventory efficiently.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <ClipboardCheck className="h-6 w-6 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-gray-800">Verify Prescriptions</h4>
                  <p className="text-sm text-gray-600">Quick and secure verification</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <PackageSearch className="h-6 w-6 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-gray-800">Inventory Management</h4>
                  <p className="text-sm text-gray-600">Real-time stock tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Users Stat */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
              <Users className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">1000+</h3>
              <p className="text-blue-100">Active Healthcare Providers</p>
            </div>
            {/* Accuracy Stat */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
              <Shield className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">98%</h3>
              <p className="text-blue-100">Prescription Accuracy</p>
            </div>
            {/* Availability Stat */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
              <Clock className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">24/7</h3>
              <p className="text-blue-100">System Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                title: "Secure System",
                description: "End-to-end encryption for all medical data"
              },
              {
                icon: <Laptop className="h-8 w-8 text-blue-600" />,
                title: "Cloud Access",
                description: "Access your dashboard from anywhere"
              },
              {
                icon: <History className="h-8 w-8 text-blue-600" />,
                title: "Real-time Updates",
                description: "Instant synchronization across devices"
              },
              {
                icon: <FileText className="h-8 w-8 text-blue-600" />,
                title: "Digital Records",
                description: "Paperless prescription management"
              },
              {
                icon: <MessageSquareText className="h-8 w-8 text-blue-600" />,
                title: "Smart Notifications",
                description: "Automated alerts and reminders"
              },
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: "Multi-user Access",
                description: "Role-based access control"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;