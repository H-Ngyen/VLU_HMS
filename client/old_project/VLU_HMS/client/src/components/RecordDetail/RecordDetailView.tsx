import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { TopBar } from "./TopBar";
import { SidebarNav } from "./SidebarNav";
import { RecordContent } from "./RecordContent";
import { DocumentList } from "./DocumentList";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const RecordDetailView = () => {
  const { id } = useParams();
  const { records, patients, user, addDocumentToRecord } = useApp();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  const record = records.find((r) => r.id === id);
  const patient = record
    ? patients.find((p) => p.id === record.patientId)
    : null;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDownloadPDF = async () => {
    const element = document.querySelector(".printable-content") as HTMLElement;
    if (!element) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 210;
      const pdfHeight = 297;
      const marginX = 15;
      const marginY = 15;
      const contentWidth = pdfWidth - 2 * marginX;
      const contentHeight = pdfHeight - 2 * marginY;

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = marginY;
      let pageCount = 0; // Track page count for multiple pages

      // First page
      pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight);
      heightLeft -= contentHeight;

      // Subsequent pages
      while (heightLeft > 0) {
        pageCount++;
        position = marginY - pageCount * contentHeight; // Adjust position for new page
        pdf.addPage();
        pdf.addImage(imgData, "PNG", marginX, position, imgWidth, imgHeight);
        heightLeft -= contentHeight;
      }

      if (record) {
        pdf.save(`HoSoBenhAn_${record.id}.pdf`);
      }
    } catch (error) {
      console.error("Lỗi khi tạo PDF:", error);
      alert("Có lỗi xảy ra khi tải xuống PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!record) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-gray-600">Không tìm thấy hồ sơ.</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-vlu-red underline hover:text-red-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <TopBar 
        patientName={record.patientName} 
        recordId={record.id} 
        onDownload={handleDownloadPDF} 
        isDownloading={isDownloading} 
      />

      <div className="flex flex-col lg:flex-row gap-8 relative">
        <SidebarNav onScrollTo={scrollToSection} />

        <div className="flex-1 min-w-0">
          <RecordContent record={record} patient={patient || undefined} />
          
          <DocumentList 
            record={record} 
            user={user} 
            addDocumentToRecord={addDocumentToRecord} 
          />
        </div>
      </div>
    </div>
  );
};
