import { useState } from "react";
import { FileText, Upload, Trash2, Eye, Edit2, Save, X } from "lucide-react";
import type { Record, Document } from "@/types";
import { XRayInputForm } from "./XRayInputForm";
import { Button } from "@/components/ui/button";

interface DocumentSectionProps {
  formData: Record;
  setFormData: React.Dispatch<React.SetStateAction<Record | null>>;
  readOnly?: boolean;
}

export const DocumentSection = ({ formData, setFormData, readOnly = false }: DocumentSectionProps) => {
  const documents = formData.documents || [];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState("Khác");
  
  // Edit State
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // X-Ray Form State
  const [isXRayFormOpen, setIsXRayFormOpen] = useState(false);
  const [editingXRayDoc, setEditingXRayDoc] = useState<Document | null>(null);
  const [viewingXRayDoc, setViewingXRayDoc] = useState<Document | null>(null);

  const handleView = (doc: Document) => {
    if (doc.type === "X-Quang" && doc.data) {
        setViewingXRayDoc(doc);
        setIsXRayFormOpen(true);
    } else if (doc.url) {
        window.open(doc.url, "_blank");
    } else {
        alert("Tài liệu này không có file đính kèm hoặc nội dung để xem.");
    }
  };

  const handleUpload = (e?: React.FormEvent) => {
    if (readOnly) return;
    if (e) e.preventDefault();
    if (!selectedFile) return;

    const newDoc: Document = {
      id: `DOC${Date.now()}`,
      name: uploadType === "X-Quang" && selectedFile.name.startsWith("XQuang_") ? "Phiếu X-Quang (Nhập tay)" : uploadType,
      type: uploadType,
      fileName: selectedFile.name,
      date: new Date().toISOString().split("T")[0],
      url: URL.createObjectURL(selectedFile),
    };

    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        documents: [...(prev.documents || []), newDoc],
      };
    });

    setSelectedFile(null);
    setUploadType("Khác");
  };

  const handleXRaySave = (file: File, xrayData?: any) => {
    if (readOnly) return;
    if (editingXRayDoc) {
        // Update existing doc
        setFormData((prev) => {
            if (!prev) return null;
            const updatedDocs = prev.documents.map((d) => 
              d.id === editingXRayDoc.id ? { 
                  ...d, 
                  fileName: file.name, 
                  url: URL.createObjectURL(file),
                  data: xrayData 
              } : d
            );
            return { ...prev, documents: updatedDocs };
        });
        setEditingXRayDoc(null);
    } else {
        // Create new doc
        const newDoc: Document = {
            id: `DOC${Date.now()}`,
            name: "Phiếu X-Quang (Nhập tay)",
            type: "X-Quang",
            fileName: file.name,
            date: new Date().toISOString().split("T")[0],
            url: URL.createObjectURL(file),
            data: xrayData
        };

        setFormData((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                documents: [...(prev.documents || []), newDoc],
            };
        });
    }
    
    // Reset states
    setUploadType("Khác");
    setIsXRayFormOpen(false); // Ensure modal closes if it wasn't already
  };

  const handleDelete = (docId: string) => {
    if (readOnly) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        documents: prev.documents.filter((d) => d.id !== docId),
      };
    });
  };

  const startEdit = (doc: Document) => {
    if (readOnly) return;
    if (doc.type === "X-Quang" && doc.data) {
        setEditingXRayDoc(doc);
        setIsXRayFormOpen(true);
    } else {
        setEditingDocId(doc.id);
        setEditName(doc.name);
    }
  };

  const saveEdit = (docId: string) => {
    if (readOnly) return;
    setFormData((prev) => {
      if (!prev) return null;
      const updatedDocs = prev.documents.map((d) => 
        d.id === docId ? { ...d, name: editName } : d
      );
      return { ...prev, documents: updatedDocs };
    });
    setEditingDocId(null);
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-end mb-3">
        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center">
          <FileText size={16} className="mr-2 text-vlu-red" />
          Tài liệu đính kèm ({documents.length})
        </h4>
      </div>

      {/* Upload Form - Hide if readOnly */}
      {!readOnly && (
        <div className="mb-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-3 items-center">
            <select
                className="p-2 border border-gray-300 rounded-md text-sm outline-none w-full md:w-40 bg-white"
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
            >
                <option>Xét nghiệm máu</option>
                <option>X-Quang</option>
                <option>Siêu âm</option>
                <option>Đơn thuốc</option>
                <option>Khác</option>
            </select>
            
            {uploadType === "X-Quang" ? (
                <div className="flex-1 flex gap-2 w-full">
                    <Button
                        type="button"
                        onClick={() => {
                            setEditingXRayDoc(null); // Reset editing state for new entry
                            setIsXRayFormOpen(true);
                        }}
                        size="sm"
                        className="bg-vlu-red hover:bg-red-700 text-white"
                    >
                        <Edit2 size={14} className="mr-2" /> Nhập phiếu X-Quang
                    </Button>
                    <div className="relative flex-1">
                        <input
                            type="file"
                            accept=".pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                        <div className="w-full h-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm text-gray-500 flex items-center justify-between">
                            <span className="truncate">{selectedFile ? selectedFile.name : "Hoặc tải file..."}</span>
                            <Upload size={14} />
                        </div>
                    </div>
                    <Button
                        disabled={!selectedFile}
                        type="button"
                        onClick={() => handleUpload()}
                        variant="secondary"
                    >
                        <Upload size={16} /> Lưu
                    </Button>
                </div>
            ) : (
                <>
                    <input
                        type="file"
                        accept=".pdf"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-vlu-red file:text-white hover:file:bg-red-700"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    <Button
                        disabled={!selectedFile}
                        type="button"
                        onClick={() => handleUpload()}
                        className="bg-vlu-red hover:bg-red-700"
                    >
                        <Upload size={16} /> Tải lên
                    </Button>
                </>
            )}
            </div>
        </div>
      )}

      {/* Document List Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3 w-16 text-center">STT</th>
              <th className="px-4 py-3">Tên tập tin</th>
              <th className="px-4 py-3">Loại tài liệu</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.length > 0 ? (
              documents.map((doc, index) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-center text-gray-500">{index + 1}</td>
                  
                  <td className="px-4 py-3 font-medium text-gray-800">
                     {editingDocId === doc.id && !readOnly ? (
                        <div className="flex items-center gap-2">
                            <input
                            type="text"
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            autoFocus
                            />
                            <Button size="icon-sm" variant="ghost" onClick={() => saveEdit(doc.id)} className="text-green-600">
                                <Save size={16} />
                            </Button>
                            <Button size="icon-sm" variant="ghost" onClick={() => setEditingDocId(null)} className="text-red-500">
                                <X size={16} />
                            </Button>
                        </div>
                     ) : (
                         <div className="flex items-center gap-2 group">
                             <FileText size={16} className="text-gray-400" />
                             <span title={doc.name} className="truncate max-w-[200px]">{doc.fileName}</span>
                         </div>
                     )}
                  </td>

                  <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {doc.type}
                      </span>
                  </td>

                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {doc.date}
                  </td>

                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <Button type="button" size="icon-sm" variant="ghost" onClick={() => handleView(doc)} className="text-blue-600 bg-blue-50 hover:bg-blue-100" title="Xem">
                        <Eye size={16} />
                    </Button>
                    {!readOnly && (
                        <>
                            <Button type="button" size="icon-sm" variant="ghost" onClick={() => startEdit(doc)} className="text-orange-600 bg-orange-50 hover:bg-orange-100" title="Sửa">
                                <Edit2 size={16} />
                            </Button>
                            <Button type="button" size="icon-sm" variant="ghost" onClick={() => handleDelete(doc.id)} className="text-red-600 bg-red-50 hover:bg-red-100" title="Xóa">
                            <Trash2 size={16} />
                            </Button>
                        </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400 italic">
                  Chưa có tài liệu đính kèm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <XRayInputForm 
        isOpen={isXRayFormOpen}
        onClose={() => {
            setIsXRayFormOpen(false);
            setEditingXRayDoc(null);
            setViewingXRayDoc(null);
        }}
        onSave={handleXRaySave}
        defaultPatientName={formData.patientName}
        defaultAge={formData.age}
        defaultGender={formData.gender}
        initialData={editingXRayDoc?.data || viewingXRayDoc?.data}
        readOnly={!!viewingXRayDoc}
      />
    </section>
  );
};