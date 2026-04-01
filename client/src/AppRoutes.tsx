import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/layout";
import RecordsPage from "./pages/RecordsPage";
import { RecordDetailView } from "./components/RecordDetail/RecordDetailView";
import { EditRecordView } from "./components/EditRecord/EditRecordView";
import { CreateRecordView } from "./components/EditRecord/CreateRecordView";
import { PatientManagementView } from "./components/Patient/Management/PatientManagementView";
import { EditPatientForm } from "./components/Patient/Edit/EditPatientForm";
import { AddPatientForm } from "./components/Patient/Add/AddPatientForm";
import { AccountManagementView } from "./components/Account/AccountManagementView";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth0 } from "@auth0/auth0-react";

function AppRoutes() {
  const { user } = useAuth0();
  const isAdmin = user?.email?.endsWith("@zer0project.onmicrosoft.com");

  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute component={Layout} />}>
          <Route path="/" element={<RecordsPage />} />
          <Route path="/record/:id" element={<RecordDetailView />} />
          <Route path="/record/edit/:id" element={<EditRecordView />} />
          <Route path="/record/create/:patientId" element={<CreateRecordView />} />
          <Route path="/patients" element={<PatientManagementView />} />
          <Route path="/patient/add" element={<AddPatientForm />} />
          <Route path="/patient/edit/:id" element={<EditPatientForm />} />
          <Route path="/account" element={isAdmin ? <AccountManagementView /> : <Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
  );
}

export default AppRoutes;
