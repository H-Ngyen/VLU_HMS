import { useState } from "react";
import {
  X,
  FileText,
  Upload,
  Trash2,
  Edit2,
  Eye,
  Save,
  File,
  Edit,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import type { Record } from "../types";

interface DocumentManagerModalProps {
  record: Record;
  onClose: () => void;
}

const DocumentManagerModal: React.FC<DocumentManagerModalProps> = ({ record, onClose }) => {
  const {
    addDocumentToRecord,
    removeDocumentFromRecord,
    updateDocumentInRecord,
  } = useApp();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState("Khác");
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // 1. Handle Upload
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    // Simulate file upload
    const newDoc = {
      id: `DOC${Date.now()}`,
      name: uploadType, // Default name based on type
      type: uploadType,
      fileName: `${record.id}_${uploadType}_${record.patientName.replace(
        /\s+/g,
        ""
      )}.pdf`, // Auto-rename convention
      date: new Date().toISOString().split("T")[0],
      url: URL.createObjectURL(selectedFile),
    };

    addDocumentToRecord(record.id, newDoc);
    setSelectedFile(null);
  };

  // 2. Handle Rename
  const startEdit = (doc: { id: string; name: string }) => {
    setEditingDocId(doc.id);
    setEditName(doc.name);
  };

  const saveEdit = (docId: string) => {
    updateDocumentInRecord(record.id, docId, editName);
    setEditingDocId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Sửa hồ sơ & tài liệu
            </h3>
            <p className="text-sm text-gray-500">
              Bệnh nhân:{" "}
              <span className="font-medium text-gray-700">
                {record.patientName}
              </span>{" "}
              - {record.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {/* Section 1: Main System Record */}
          <section>
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center">
              <FileText size={16} className="mr-2 text-vlu-red" />
              1. Hồ sơ bệnh án điện tử (Dữ liệu nhập liệu)
            </h4>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-md border border-blue-100 mr-3 text-blue-600">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-800">
                    Bệnh án{" "}
                    {record.type === "internal" ? "Nội Khoa" : record.type}
                  </p>
                  <p className="text-xs text-gray-500">
                    Cập nhật lần cuối: {record.admissionDate}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/record/edit/${record.id}`);
                  }}
                  className="px-4 py-2 bg-white border border-yellow-300 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-50 transition shadow-sm flex items-center"
                >
                  <Edit size={16} className="mr-2" /> Chỉnh sửa
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/record/${record.id}`);
                  }}
                  className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 hover:border-blue-300 transition shadow-sm flex items-center"
                >
                  <Eye size={16} className="mr-2" /> Xem chi tiết
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Attached Documents */}
          <section>
            <div className="flex justify-between items-end mb-3">
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center">
                <File size={16} className="mr-2 text-vlu-red" />
                2. Tài liệu đính kèm ({record.documents?.length || 0})
              </h4>
            </div>

            {/* Upload Box */}
            <div className="mb-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4">
              <form
                onSubmit={handleUpload}
                className="flex flex-col md:flex-row gap-3 items-center"
              >
                <select
                  className="p-2 border border-gray-300 rounded-md text-sm outline-none w-full md:w-40"
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                >
                  <option>Xét nghiệm máu</option>
                  <option>X-Quang</option>
                  <option>Siêu âm</option>
                  <option>Đơn thuốc</option>
                  <option>Khác</option>
                </select>
                <input
                  type="file"
                  accept=".pdf"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-vlu-red file:text-white hover:file:bg-red-700"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <button
                  disabled={!selectedFile}
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition"
                >
                  <Upload size={16} className="inline mr-1" /> Tải lên
                </button>
              </form>
            </div>

            {/* Documents Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-4 py-3">Tên tài liệu</th>
                    <th className="px-4 py-3">Tên file</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {record.documents && record.documents.length > 0 ? (
                    record.documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {editingDocId === doc.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                autoFocus
                              />
                              <button
                                onClick={() => saveEdit(doc.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={() => setEditingDocId(null)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <span className="flex items-center gap-2 group">
                              {doc.name}
                              <button
                                onClick={() => startEdit(doc)}
                                className="text-gray-300 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition"
                              >
                                <Edit2 size={12} />
                              </button>
                            </span>
                          )}
                        </td>
                        <td
                          className="px-4 py-3 text-gray-500 font-mono text-xs truncate max-w-[200px]"
                          title={doc.fileName}
                        >
                          {doc.fileName}
                        </td>
                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                            title="Xem"
                          >
                            <Eye size={16} />
                          </a>
                          <button
                            onClick={() => {
                              if (window.confirm("Xóa tài liệu này?"))
                                removeDocumentFromRecord(record.id, doc.id);
                            }}
                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-8 text-center text-gray-400 italic"
                      >
                        Chưa có tài liệu đính kèm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagerModal;
