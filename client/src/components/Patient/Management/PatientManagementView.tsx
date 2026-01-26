import { useState, useMemo } from "react";
import { INITIAL_PATIENTS } from "@/mockData";
import { PatientTable } from "./PatientTable";
import { PatientPageHeader } from "./PatientPageHeader";

export const PatientManagementView = () => {
  const [patients] = useState(INITIAL_PATIENTS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = useMemo(() => {
     return patients.filter(
      (p) =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.cccd && p.cccd.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [patients, searchTerm]);

  return (
    <div className="w-full p-4 md:p-6">
      <PatientPageHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <PatientTable patients={filteredPatients} />
    </div>
  );
};
