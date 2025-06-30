import React, { useState } from 'react';
import { usePrescriptions } from '../context/PrescriptionContext';
import { toast } from 'react-hot-toast';

const PrescriptionHistory: React.FC = () => {
  const { prescriptions, deletePrescription, loading, error } = usePrescriptions();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrescriptions = prescriptions.filter(prescription => 
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medications.some(med => 
      med.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await deletePrescription(id);
        toast.success('Prescription deleted successfully');
      } catch (err) {
        toast.error('Failed to delete prescription');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by patient name, prescription number, or medication..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6">
        {filteredPrescriptions.map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{prescription.patientName}</h3>
                <p className="text-gray-600">Prescription #: {prescription.prescriptionNumber}</p>
                <p className="text-gray-600">Date: {new Date(prescription.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDelete(prescription.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Medications:</h4>
              <ul className="list-disc pl-5">
                {prescription.medications.map((med, index) => (
                  <li key={index} className="mb-1">
                    {med.name} - {med.dosage} ({med.frequency}) for {med.duration}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Instructions:</h4>
              <p className="text-gray-700">{prescription.instructions}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Prescribed by: Dr. {prescription.doctorName} (License: {prescription.doctorLicense})
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionHistory; 