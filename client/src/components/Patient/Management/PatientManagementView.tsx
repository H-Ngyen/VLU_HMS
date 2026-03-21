import { useState, useMemo, useEffect } from "react";
import { api } from "@/services/api";
import { PatientTable } from "./PatientTable";
import { PatientPageHeader } from "./PatientPageHeader";
import type { Patient } from "@/types";

export const PatientManagementView = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [ethnicities, setEthnicities] = useState<{ id: number; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientsData, ethnicitiesData] = await Promise.all([
        api.patients.getAll(),
        api.ethnicities.getAll()
      ]);
      
      // Map ethnicityId to ethnicity object
      const patientsWithEthnicity = patientsData.map(patient => ({
        ...patient,
        ethnicity: ethnicitiesData.find(e => e.id === patient.ethnicityId)
      }));
      
      setPatients(patientsWithEthnicity);
      setEthnicities(ethnicitiesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = useMemo(() => {
     return patients.filter(
      (p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id?.toString().includes(searchTerm.toLowerCase()) ||
        p.healthInsuranceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  if (loading) {
    return (
      <div className="w-full p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      <PatientPageHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <PatientTable patients={filteredPatients} onPatientDeleted={fetchData} />
    </div>
  );
};
