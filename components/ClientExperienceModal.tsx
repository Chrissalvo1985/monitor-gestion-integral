
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useData } from '../hooks/useData';
import { ClientExperience } from '../types';

interface ClientExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: ClientExperience | undefined;
}

export const ClientExperienceModal: React.FC<ClientExperienceModalProps> = ({ isOpen, onClose, experience }) => {
  const { selectedClientId, addClientExperience, updateClientExperience } = useData();
  
  const getInitialState = () => ({
    nps_score: 0,
    last_survey_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (experience) {
      setFormData({
        nps_score: experience.nps_score,
        last_survey_date: experience.last_survey_date.split('T')[0],
        notes: experience.notes || '',
      });
    } else {
      setFormData(getInitialState());
    }
  }, [experience, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'nps_score' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || selectedClientId === 'all') return;

    if (experience) {
      updateClientExperience({ ...experience, ...formData });
    } else {
      addClientExperience({ ...formData, client_id: selectedClientId });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gestionar NPS Cliente">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nps_score" className="block text-sm font-medium text-gray-700">Puntaje NPS (-100 a 100)</label>
          <input type="number" name="nps_score" id="nps_score" value={formData.nps_score} onChange={handleChange} min="-100" max="100" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
        </div>
        <div>
          <label htmlFor="last_survey_date" className="block text-sm font-medium text-gray-700">Fecha de Encuesta</label>
          <input type="date" name="last_survey_date" id="last_survey_date" value={formData.last_survey_date} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notas</label>
          <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 text-sm sm:text-base order-2 sm:order-1">Cancelar</button>
          <button type="submit" className="bg-[#0055B8] text-white px-4 py-2 rounded-md hover:bg-[#003F8C] text-sm sm:text-base order-1 sm:order-2">Guardar</button>
        </div>
      </form>
    </Modal>
  );
};
