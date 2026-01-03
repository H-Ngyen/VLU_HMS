import { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import DocumentManagerModal from "../components/DocumentManagerModal";
import {
  Search,
  FileText,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  Settings,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RECORD_TYPES } from "../mockData";
import type { Record } from "../types";

const ITEMS_PER_PAGE = 20;

const StudentRepository = () => {
  const { records, user, deleteRecord } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRecordForManagement, setSelectedRecordForManagement] =
    useState<Record | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<Record | null>(null);

  useEffect(() => {
    const patientIdParam = searchParams.get("patientId");
    if (patientIdParam) {
      setSearchTerm(patientIdParam);
      setInputValue(patientIdParam);
    }
  }, [searchParams]);

  const displayData = useMemo(() => {
    if (!searchTerm.trim()) {
      const sorted = [...records].sort(
        (a, b) =>
          new Date(b.admissionDate).getTime() -
          new Date(a.admissionDate).getTime()
      );

      let initialData = sorted.slice(0, 20);

      if (filterType !== "all") {
        initialData = initialData.filter((r) => r.type === filterType);
      }
      return initialData;
    }

    return records.filter((record) => {
      const term = searchTerm.toLowerCase();

      const matchesSearch =
        record.patientName.toLowerCase().includes(term) ||
        record.id.toLowerCase().includes(term) ||
        (record.patientId && record.patientId.toLowerCase().includes(term));

      const matchesType = filterType === "all" || record.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [records, searchTerm, filterType]);

  const totalPages = Math.ceil(displayData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRecords = displayData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
      setCurrentPage(1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const handleDeleteRecord = () => {
    if (recordToDelete) {
      deleteRecord(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  const getTypeName = (typeId: string) => {
    const type = RECORD_TYPES.find((t) => t.id === typeId);
    return type ? type.name : typeId;
  };

  const getStatusBadge = (record: Record) => {
    if (record.dischargeDate) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Đã ra viện
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          Đang điều trị
        </span>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kho Hồ Sơ Bệnh Án</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto items-center">
          <div className="flex items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã hồ sơ..."
                className="w-full pl-9 pr-3 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vlu-red focus:border-transparent outline-none text-sm transition-all"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <div className="flex items-center text-gray-500 text-sm font-medium whitespace-nowrap">
            <Filter size={16} className="mr-2" /> Khoa:
          </div>
          <select
            className="flex-1 md:w-48 h-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vlu-red outline-none text-sm bg-white"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả</option>
            {RECORD_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                <th className="px-6 py-4 w-24">Mã HS</th>
                <th className="px-6 py-4">Bệnh Nhân</th>
                <th className="px-6 py-4">Ngày Sinh</th>
                <th className="px-6 py-4">Tuổi / Giới</th>
                <th className="px-6 py-4">Khoa / Loại</th>
                <th className="px-6 py-4">Ngày vào viện</th>
                <th className="px-6 py-4 text-center">Trạng Thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 transition group"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-gray-600 font-medium">
                      {record.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 group-hover:text-vlu-red transition">
                        {record.patientName}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 font-mono">
                        {record.patientId}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.dob}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.age} / {record.gender}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${
                            record.type === "internal"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {getTypeName(record.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.admissionDate}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {getStatusBadge(record)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/record/${record.id}`)}
                          className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center transition"
                        >
                          <Eye size={14} className="mr-1" /> Xem
                        </button>

                        {user?.role !== "student" && (
                          <button
                            onClick={() =>
                              setSelectedRecordForManagement(record)
                            }
                            className="text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center transition border border-gray-200"
                          >
                            <Settings size={14} className="mr-1" /> Sửa
                          </button>
                        )}

                        {user?.role !== "student" && (
                          <button
                            onClick={() => setRecordToDelete(record)}
                            className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center transition"
                          >
                            <Trash2 size={14} className="mr-1" /> Xóa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={48} className="text-gray-200 mb-4" />
                      <span className="text-lg font-medium text-gray-600">
                        Không tìm thấy hồ sơ phù hợp
                      </span>
                      <span className="text-sm text-gray-400 mt-1">
                        Vui lòng thử lại với từ khóa hoặc bộ lọc khác
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {displayData.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{" "}
              <span className="font-medium">
                {Math.min(startIndex + ITEMS_PER_PAGE, displayData.length)}
              </span>{" "}
              trên tổng số{" "}
              <span className="font-medium">{displayData.length}</span> hồ sơ
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md border border-gray-300 bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-xs font-medium text-gray-700">
                Trang {currentPage} / {totalPages || 1}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1 rounded-md border border-gray-300 bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedRecordForManagement && (
        <DocumentManagerModal
          record={selectedRecordForManagement}
          onClose={() => setSelectedRecordForManagement(null)}
        />
      )}

      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
                <AlertTriangle size={40} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa</h3>
              <p className="text-sm text-gray-500 mt-2">
                Bạn có chắc chắn muốn xóa hồ sơ của bệnh nhân{" "}
                <span className="font-bold">{recordToDelete.patientName}</span>{" "}
                (ID: {recordToDelete.id})? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setRecordToDelete(null)}
                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeleteRecord}
                className="px-5 py-2 bg-red-600 border border-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRepository;
