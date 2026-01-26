import { useParams } from "react-router-dom";
import { EditPatientForm } from "@/components/EditPatient/EditPatientForm";

const EditPatientPage = () => {
  const { id } = useParams();
  
  return <EditPatientForm key={id} />;
};

export default EditPatientPage;