import { useState, useMemo, useEffect } from "react";
import type { Record } from "@/types";

const ITEMS_PER_PAGE = 20;

export const useRecordFilter = (records: Record[], initialSearch: string = "") => {
  const [inputValue, setInputValue] = useState(initialSearch);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const filteredRecords = useMemo(() => {
    if (!searchTerm.trim() && filterType === "all") {
      return [...records].sort(
        (a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
      );
    }

    return records.filter((record) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        record.patientName.toLowerCase().includes(term) ||
        record.id.toLowerCase().includes(term) ||
        (record.patientId && record.patientId.toLowerCase().includes(term)) ||
        (record.cccd && record.cccd.toLowerCase().includes(term));

      const matchesType = filterType === "all" || record.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [records, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    inputValue,
    setInputValue,
    filterType,
    setFilterType,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    currentRecords,
    totalRecords: filteredRecords.length,
  };
};
