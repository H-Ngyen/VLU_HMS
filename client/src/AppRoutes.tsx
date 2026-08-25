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
import { DepartmentManagementView } from "./components/Department/DepartmentManagementView";
import LoginPage from "./pages/LoginPage";
import PatientLoginPage from "./pages/PatientLoginPage";
import PatientOnboardingPage from "./pages/PatientOnboardingPage";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import { ClinicalRecordPage } from "./pages/ClinicalRecordPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import DoctorAppointmentsPage from "./pages/DoctorAppointmentsPage";

function AppRoutes() {
  const { isAdmin, isTeacher, isPatient } = useAuth();

  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/patient-login" element={<PatientLoginPage />} />
        <Route path="/patient-onboarding" element={<PatientOnboardingPage />} />
        
        <Route element={<ProtectedRoute component={Layout} />}>
          <Route path="/" element={
            isAdmin || isTeacher ? <DashboardPage /> : 
            (isPatient ? <Navigate to="/patient-dashboard" replace /> : <Navigate to="/records" replace />)
          } />
          
          <Route path="/patient-dashboard" element={isPatient ? <PatientDashboardPage /> : <Navigate to="/" replace />} />
          
          {/* Restrict to Admins and Teachers */}
          <Route path="/records" element={isAdmin || isTeacher ? <RecordsPage /> : <Navigate to="/" replace />} />
          <Route path="/record/:id" element={isAdmin || isTeacher ? <RecordDetailView /> : <Navigate to="/" replace />} />
          <Route path="/record/edit/:id" element={isAdmin || isTeacher ? <EditRecordView /> : <Navigate to="/" replace />} />
          <Route path="/record/create/:patientId" element={isAdmin || isTeacher ? <CreateRecordView /> : <Navigate to="/" replace />} />
          <Route path="/record/edit/:recordId/xray/:id" element={isAdmin || isTeacher ? <ClinicalRecordPage type="xray" /> : <Navigate to="/" replace />} />
          <Route path="/record/edit/:recordId/hematology/:id" element={isAdmin || isTeacher ? <ClinicalRecordPage type="hematology" /> : <Navigate to="/" replace />} />
          <Route path="/patients" element={isAdmin || isTeacher ? <PatientManagementView /> : <Navigate to="/" replace />} />
          <Route path="/patient/add" element={isAdmin || isTeacher ? <AddPatientForm /> : <Navigate to="/" replace />} />
          <Route path="/patient/edit/:id" element={isAdmin || isTeacher ? <EditPatientForm /> : <Navigate to="/" replace />} />
          <Route path="/departments" element={isAdmin || isTeacher ? <DepartmentManagementView /> : <Navigate to="/" replace />} />
          <Route path="/doctor-appointments" element={isAdmin || isTeacher ? <DoctorAppointmentsPage /> : <Navigate to="/" replace />} />
          
          {/* Restrict to Admins only */}
          <Route path="/account" element={isAdmin ? <AccountManagementView /> : <Navigate to="/" replace />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
  );
}

export default AppRoutes;
