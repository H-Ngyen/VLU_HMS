import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PatientTable } from './PatientTable';
import { PatientPageHeader } from './PatientPageHeader';

export const PatientManagementView = () => {
  const { patients } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
        <PatientPageHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <PatientTable patients={filteredPatients} />
    </div>
  );
};
