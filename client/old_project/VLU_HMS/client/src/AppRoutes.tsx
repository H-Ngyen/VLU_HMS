import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/layout";
import { AppProvider } from "./context/AppContext";

// Static Imports (Tải ngay từ đầu, không chờ, không xoay)
import StudentRepository from "./pages/StudentRepositoryPage";
import PatientManagement from "./pages/PatientManagementPage";
import AddPatient from "./pages/AddPatientPage";
import EditPatient from "./pages/EditPatientPage";
import CreateRecord from "./pages/CreateRecordPage";
import EditRecord from "./pages/EditRecordPage";
import AccountManagement from "./pages/AccountManagementPage";
import RecordDetail from "./pages/RecordDetailPage";

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
