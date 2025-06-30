import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { usePrescriptions } from '../context/PrescriptionContext';
import { toast } from 'react-hot-toast';
import { User, Calendar, ArrowLeft } from 'lucide-react';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const NewPrescription: React.FC = () => {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { addPrescription } = usePrescriptions();
  const [selectedPatient, setSelectedPatient] = useState<number | ''>('');
  const [medications, setMedications] = useState<Medication[]>([{ name: '', dosage: '', frequency: '', duration: '' }]);
  const [instructions, setInstructions] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const newMedications = [...medications];
    newMedications[index] = { ...newMedications[index], [field]: value };
    setMedications(newMedications);
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedication = (index: number) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      toast.error('Please select a patient');
      return;
    }

    if (medications.some(med => !med.name.trim() || !med.dosage.trim() || !med.frequency.trim())) {
      toast.error('Please fill in all medication details');
      return;
    }

    try {
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const prescriptionNumber = `RX-${year}${month}${day}-${selectedPatient.toString().padStart(4, '0')}-${Date.now().toString().slice(-3)}`;

      const selectedPatientData = patients.find(p => p.id === selectedPatient);
      if (!selectedPatientData) {
        toast.error('Selected patient not found');
        return;
      }

      await addPrescription({
        patientId: selectedPatient,
        patientName: selectedPatientData.name,
        date,
        medications,
        instructions,
        prescriptionNumber,
        doctorName: "Dr. Smith", // TODO: Get from auth context
        doctorLicense: "MD12345" // TODO: Get from auth context
      });
      
      toast.success('Prescription created successfully');
      navigate('/doctor/prescription-history');
    } catch (error) {
      toast.error('Failed to create prescription');
    }
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
              <h1 className="text-2xl font-bold text-gray-800">New Prescription</h1>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Patient
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} (ID: {patient.id})
                    </option>
                  ))}
                </select>
              </div>
              {patients.length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  No patients found. Please add patients in the Patient Records page first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medications
              </label>
              <div className="space-y-4">
                {medications.map((medication, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Medication Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Dosage"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={medication.dosage}
                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Frequency"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={medication.frequency}
                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                        required
                      />
                      {medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMedication}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Another Medication
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Enter instructions for the patient"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/doctor/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Prescription
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPrescription;