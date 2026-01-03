import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/layout";
import { AppProvider } from "./context/AppContext";
import StudentRepository from "./pages/StudentRepository";
import PatientManagement from "./pages/PatientManagement";
import AddPatient from "./pages/AddPatient";
import EditPatient from "./pages/EditPatient";
import CreateRecord from "./pages/CreateRecord";
import EditRecord from "./pages/EditRecord";
import AccountManagement from "./pages/AccountManagement";
import RecordDetail from "./pages/RecordDetail";

function AppRoutes() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/repository" element={<StudentRepository />} />
          <Route path="/patient-management" element={<PatientManagement />} />
          <Route path="/patients/new" element={<AddPatient />} />
          <Route path="/patients/edit/:id" element={<EditPatient />} />
          <Route path="/records/create/:patientId" element={<CreateRecord />} />
          <Route path="/record/edit/:id" element={<EditRecord />} />
          <Route path="/accountmanager" element={<AccountManagement />} />
          <Route path="/record/:id" element={<RecordDetail />} />
          <Route path="*" element={<Navigate to="/repository" replace />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}

export default AppRoutes;
