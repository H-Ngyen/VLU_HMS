import { useParams } from "react-router-dom";
import { CreateRecordForm } from "@/components/CreateRecord/CreateRecordForm";

const CreateRecordPage = () => {
  const { patientId } = useParams();
  
  // Sử dụng key để buộc React remount component khi patientId thay đổi.
  // Điều này giúp reset state formData mà không cần useEffect phức tạp.
  return <CreateRecordForm key={patientId} />;
};

export default CreateRecordPage;