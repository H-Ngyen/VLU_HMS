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

function AppRoutes() {
  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<RecordsPage />} />
          <Route path="/record/:id" element={<RecordDetailView />} />
          <Route path="/record/edit/:id" element={<EditRecordView />} />
          <Route path="/record/create/:patientId" element={<CreateRecordView />} />
          <Route path="/patients" element={<PatientManagementView />} />
          <Route path="/patient/add" element={<AddPatientForm />} />
          <Route path="/patient/edit/:id" element={<EditPatientForm />} />
          <Route path="/account" element={<AccountManagementView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
  );
}

export default AppRoutes;
