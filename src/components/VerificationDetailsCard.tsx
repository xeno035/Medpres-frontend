import React from 'react';
import { FileText, CheckCircle2, UserCheck } from 'lucide-react';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
}

interface Prescription {
  prescriptionNumber: string;
  patientName: string;
  date: string;
  status: string;
  doctorName: string;
  doctorSpecialization?: string;
  doctorLicense?: string;
  medications: Medication[];
  instructions?: string;
}

interface Verification {
  verifiedBy: string;
  verificationDate: string;
  status: string;
  notes?: string;
  pharmacyName?: string;
}

interface Props {
  prescription: Prescription;
  verification: Verification;
}

const VerificationDetailsCard: React.FC<Props> = ({ prescription, verification }) => (
  <div className="bg-white rounded-xl shadow-lg p-8">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Verification Details</h1>
      <div className="flex items-center text-green-600">
        <CheckCircle2 className="h-6 w-6 mr-2" />
        <span className="font-semibold">{verification.status === 'success' ? 'Verified' : verification.status}</span>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Prescription Information
        </h2>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-500">Prescription Number:</span>
            <p className="font-medium text-blue-600">{prescription.prescriptionNumber}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Patient Name:</span>
            <p className="font-medium">{prescription.patientName}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Date Created:</span>
            <p className="font-medium">{prescription.date}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Status:</span>
            <p className="font-medium text-green-600">{prescription.status}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Created By:</span>
            <p className="font-medium">{prescription.doctorName}</p>
          </div>
          {prescription.doctorSpecialization && (
            <div>
              <span className="text-sm text-gray-500">Specialization:</span>
              <p className="font-medium">{prescription.doctorSpecialization}</p>
            </div>
          )}
          {prescription.doctorLicense && (
            <div>
              <span className="text-sm text-gray-500">License Number:</span>
              <p className="font-medium">{prescription.doctorLicense}</p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-green-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <UserCheck className="h-5 w-5 mr-2" />
          Verification Information
        </h2>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-500">Verified By:</span>
            <p className="font-medium">{verification.verifiedBy}</p>
          </div>
          {verification.pharmacyName && (
            <div>
              <span className="text-sm text-gray-500">Pharmacy:</span>
              <p className="font-medium">{verification.pharmacyName}</p>
            </div>
          )}
          <div>
            <span className="text-sm text-gray-500">Verification Date:</span>
            <p className="font-medium">{verification.verificationDate}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Status:</span>
            <p className="font-medium text-green-600">{verification.status}</p>
          </div>
          {verification.notes && (
            <div>
              <span className="text-sm text-gray-500">Notes:</span>
              <p className="font-medium">{verification.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Medications</h2>
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="space-y-4">
          {Array.isArray(prescription.medications) && prescription.medications.length > 0 ? (
            prescription.medications.map((med, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{med.name}</h3>
                    <p className="text-sm text-gray-600">
                      Dosage: {med.dosage} | Frequency: {med.frequency}
                    </p>
                    {med.duration && (
                      <p className="text-sm text-gray-600">Duration: {med.duration}</p>
                    )}
                  </div>
                  <div className="text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No medications listed</div>
          )}
        </div>
      </div>
    </div>
    {prescription.instructions && (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Instructions</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-gray-700 whitespace-pre-wrap">{prescription.instructions}</p>
        </div>
      </div>
    )}
  </div>
);

export default VerificationDetailsCard;