import { useParams } from "react-router-dom";
import { EditRecordForm } from "@/components/EditRecord/EditRecordForm";

const EditRecordPage = () => {
  const { id } = useParams();
  
  return <EditRecordForm key={id} />;
};

export default EditRecordPage;
