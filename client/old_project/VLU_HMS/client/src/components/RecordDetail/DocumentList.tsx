import { useState } from "react";
import { Upload, File, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Record, User } from "@/types";

interface DocumentListProps {
  record: Record;
  user: User | null;
  addDocumentToRecord: (recordId: string, document: any) => void;
}

export const DocumentList = ({ record, user, addDocumentToRecord }: DocumentListProps) => {
  const [showUpload, setShowUpload] = useState(false);
  const [docType, setDocType] = useState("Bệnh án");
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - (record.age || 0);
    const sanitizedName = (record.patientName || "").replace(/\s+/g, "");
    const sanitizedDocType = docType.replace(/\s+/g, "");
    const newFileName = `${record.id}_${sanitizedDocType}_${sanitizedName}_${birthYear}.pdf`;
    const newDoc = {
      id: `DOC${Date.now()}`,
      name: docType,
      type: docType,
      fileName: newFileName,
      date: new Date().toISOString().split("T")[0],
      url: URL.createObjectURL(selectedFile),
    };
    addDocumentToRecord(record.id, newDoc);
    setSelectedFile(null);
    setShowUpload(false);
    alert(`Đã thêm tài liệu: ${newFileName}`);
  };

  return (
    <section
      id="documents"
      className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 print-hide"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 uppercase flex items-center">
          <File size={20} className="mr-2 text-blue-500" />
          Tài liệu & Kết quả Cận lâm sàng
        </h2>
        {user?.role === "teacher" && (
          <Button
            variant="ghost"
            onClick={() => setShowUpload(!showUpload)}
            className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center"
          >
            <Upload size={14} className="mr-1" /> Thêm tài liệu
          </Button>
        )}
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in fade-in">
          <form onSubmit={handleUpload} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Loại tài liệu</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bệnh án">Bệnh án</SelectItem>
                    <SelectItem value="X-Quang">X-Quang</SelectItem>
                    <SelectItem value="Xét nghiệm máu">Xét nghiệm máu</SelectItem>
                    <SelectItem value="Siêu âm">Siêu âm</SelectItem>
                    <SelectItem value="Đơn thuốc">Đơn thuốc</SelectItem>
                    <SelectItem value="Giấy ra viện">Giấy ra viện</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1 block">File (PDF)</Label>
                <Input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Lưu tài liệu
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Document List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {record.documents && record.documents.length > 0 ? (
          record.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center min-w-0">
                <div className="bg-red-100 p-2 rounded text-red-600 mr-3">
                  <File size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {doc.fileName}
                  </p>
                  <p className="text-xs text-gray-500">{doc.type}</p>
                </div>
              </div>
              <a
                href={doc.url || "#"}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition"
                title="Xem"
              >
                <Eye size={16} />
              </a>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-400 text-sm italic border-2 border-dashed border-gray-200 rounded-lg">
            Chưa có tài liệu nào được tải lên.
          </div>
        )}
      </div>
    </section>
  );
};
