import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Eye, Edit2, Trash2 } from "lucide-react";
import type { Record, Document } from "@/types";
import { XRayInputForm } from "./XRayInputForm";
import { HematologyInputForm } from "./HematologyInputForm";

interface PhieuYSectionProps {
  formData: Record;
  setFormData: React.Dispatch<React.SetStateAction<Record | null>>;
  readOnly?: boolean;
}

export const PhieuYSection = ({ formData, setFormData, readOnly = false }: PhieuYSectionProps) => {
  const [activeFormType, setActiveFormType] = useState<string>("xray");
  
  // XRay State
  const [isXRayFormOpen, setIsXRayFormOpen] = useState(false);
  const [editingXRayDoc, setEditingXRayDoc] = useState<Document | null>(null);
  const [viewingXRayDoc, setViewingXRayDoc] = useState<Document | null>(null);

  // Hematology State
  const [isHematologyFormOpen, setIsHematologyFormOpen] = useState(false);
  const [editingHematologyDoc, setEditingHematologyDoc] = useState<Document | null>(null);
  const [viewingHematologyDoc, setViewingHematologyDoc] = useState<Document | null>(null);

  // Filter documents
  const xrayDocuments = (formData.documents || []).filter(d => d.type === "X-Quang");
  const hematologyDocuments = (formData.documents || []).filter(d => d.type === "XN-HuyetHoc");

  const handleXRaySave = (file: File, xrayData?: any) => {
    if (readOnly) return;
    if (editingXRayDoc) {
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
        const newDoc: Document = {
            id: `DOC${Date.now()}`,
            name: "Phiếu X-Quang",
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
    setIsXRayFormOpen(false); 
  };

  const handleHematologySave = (file: File, data?: any) => {
    if (readOnly) return;
    if (editingHematologyDoc) {
        setFormData((prev) => {
            if (!prev) return null;
            const updatedDocs = prev.documents.map((d) => 
              d.id === editingHematologyDoc.id ? { 
                  ...d, 
                  fileName: file.name, 
                  url: URL.createObjectURL(file),
                  data: data 
              } : d
            );
            return { ...prev, documents: updatedDocs };
        });
        setEditingHematologyDoc(null);
    } else {
        const newDoc: Document = {
            id: `DOC${Date.now()}`,
            name: "Phiếu XN Huyết Học",
            type: "XN-HuyetHoc",
            fileName: file.name,
            date: new Date().toISOString().split("T")[0],
            url: URL.createObjectURL(file),
            data: data
        };
        setFormData((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                documents: [...(prev.documents || []), newDoc],
            };
        });
    }
    setIsHematologyFormOpen(false); 
  };

  const handleDelete = (docId: string) => {
    if (readOnly) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa phiếu này?")) return;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        documents: prev.documents.filter((d) => d.id !== docId),
      };
    });
  };

  const handleView = (doc: Document) => {
     if (doc.url) {
        window.open(doc.url, "_blank");
     } else if (doc.data) {
        if (doc.type === "X-Quang") {
            setViewingXRayDoc(doc);
            setIsXRayFormOpen(true);
        } else if (doc.type === "XN-HuyetHoc") {
            setViewingHematologyDoc(doc);
            setIsHematologyFormOpen(true);
        }
     }
  };

  const handleEdit = (doc: Document) => {
    if (readOnly) return;
    if (doc.type === "X-Quang") {
        setEditingXRayDoc(doc);
        setIsXRayFormOpen(true);
    } else if (doc.type === "XN-HuyetHoc") {
        setEditingHematologyDoc(doc);
        setIsHematologyFormOpen(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Sidebar for Phieu Y Types */}
      <div className="w-full lg:w-48 flex-shrink-0 space-y-1">
        <div className="font-bold text-gray-700 px-4 py-2 mb-2 uppercase text-sm">Danh sách phiếu</div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setActiveFormType("xray")}
          className={`w-full justify-start text-left h-auto py-3 px-4 rounded-lg font-medium transition-all whitespace-normal text-xs leading-snug ${
            activeFormType === "xray" 
              ? "bg-vlu-red text-white hover:bg-red-800 shadow-sm" 
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          1. Phiếu chiếu/ chụp X-quang (08/BV2)
        </Button>
         <Button
          type="button"
          variant="ghost"
          onClick={() => setActiveFormType("blood_test")}
          className={`w-full justify-start text-left h-auto py-3 px-4 rounded-lg font-medium transition-all whitespace-normal text-xs leading-snug ${
            activeFormType === "blood_test" 
              ? "bg-vlu-red text-white hover:bg-red-800 shadow-sm" 
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          2. Phiếu xét nghiệm Huyết học (17/BV2)
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeFormType === "xray" && (
          <div>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <FileText className="mr-2 text-vlu-red" />
                    Quản lý Phiếu X-Quang
                </h3>
                {!readOnly && (
                    <Button type="button" onClick={() => { setEditingXRayDoc(null); setIsXRayFormOpen(true); }} className="bg-vlu-red hover:bg-red-700 text-white">
                        <Plus size={16} className="mr-2" /> Tạo phiếu mới
                    </Button>
                )}
             </div>

             <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-4 py-3 w-16 text-center">STT</th>
                            <th className="px-4 py-3">Tên phiếu</th>
                            <th className="px-4 py-3">Ngày tạo</th>
                            <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {xrayDocuments.length > 0 ? (
                            xrayDocuments.map((doc, index) => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-center text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{doc.name || "Phiếu X-Quang"}</td>
                                    <td className="px-4 py-3 text-gray-500">{doc.date}</td>
                                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                                        <Button type="button" size="icon-sm" variant="ghost" onClick={() => handleView(doc)} className="text-blue-600 bg-blue-50 hover:bg-blue-100">
                                            <Eye size={16} />
                                        </Button>
                                        {!readOnly && (
                                            <>
                                                <Button type="button" size="icon-sm" variant="ghost" onClick={() => handleEdit(doc)} className="text-orange-600 bg-orange-50 hover:bg-orange-100">
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button type="button" size="icon-sm" variant="ghost" onClick={() => handleDelete(doc.id)} className="text-red-600 bg-red-50 hover:bg-red-100">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-400 italic">
                                    Chưa có phiếu X-Quang nào được tạo.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
          </div>
        )}
        
        {activeFormType === "blood_test" && (
            <div>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <FileText className="mr-2 text-vlu-red" />
                    Quản lý Phiếu XN Huyết Học
                </h3>
                {!readOnly && (
                    <Button type="button" onClick={() => { setEditingHematologyDoc(null); setIsHematologyFormOpen(true); }} className="bg-vlu-red hover:bg-red-700 text-white">
                        <Plus size={16} className="mr-2" /> Tạo phiếu mới
                    </Button>
                )}
             </div>

             <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-4 py-3 w-16 text-center">STT</th>
                            <th className="px-4 py-3">Tên phiếu</th>
                            <th className="px-4 py-3">Ngày tạo</th>
                            <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {hematologyDocuments.length > 0 ? (
                            hematologyDocuments.map((doc, index) => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-center text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{doc.name || "Phiếu XN Huyết Học"}</td>
                                    <td className="px-4 py-3 text-gray-500">{doc.date}</td>
                                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                                        <Button type="button" size="icon-sm" variant="ghost" onClick={() => handleView(doc)} className="text-blue-600 bg-blue-50 hover:bg-blue-100">
                                            <Eye size={16} />
                                        </Button>
                                        {!readOnly && (
                                            <>
                                                <Button type="button" size="icon-sm" variant="ghost" onClick={() => handleEdit(doc)} className="text-orange-600 bg-orange-50 hover:bg-orange-100">
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button type="button" size="icon-sm" variant="ghost" onClick={() => handleDelete(doc.id)} className="text-red-600 bg-red-50 hover:bg-red-100">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-400 italic">
                                    Chưa có phiếu xét nghiệm nào được tạo.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
          </div>
        )}
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
        readOnly={!!viewingXRayDoc || readOnly} 
      />

       <HematologyInputForm 
        isOpen={isHematologyFormOpen}
        onClose={() => {
            setIsHematologyFormOpen(false);
            setEditingHematologyDoc(null);
            setViewingHematologyDoc(null);
        }}
        onSave={handleHematologySave}
        defaultPatientName={formData.patientName}
        defaultAge={formData.age}
        defaultGender={formData.gender}
        initialData={editingHematologyDoc?.data || viewingHematologyDoc?.data}
        readOnly={!!viewingHematologyDoc || readOnly} 
      />
    </div>
  );
};
