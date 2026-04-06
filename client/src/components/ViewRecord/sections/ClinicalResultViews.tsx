import { FileText } from "lucide-react";
import type { XRayData } from "../../EditRecord/sections/XRayInputForm";
import type { HematologyData } from "../../EditRecord/sections/HematologyInputForm";

interface XRayResultViewProps {
  data: XRayData;
}

export const XRayResultView = ({ data }: XRayResultViewProps) => {
  const showResultSection = data.status >= 2 || data.status === 3;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-8 print:shadow-none print:border-none">
        <div className="flex justify-between items-start mb-6">
            <div className="w-[30%] text-xs">
                <p className="m-0">Sở Y tế: {data.healthDept || "..................."}</p>
                <p className="m-0">BV: {data.hospital || "..................."}</p>
            </div>
            <div className="w-[40%] text-center">
                <h1 className="text-lg font-bold uppercase m-0 text-vlu-red">Phiếu chiếu/ chụp X-Quang</h1>
                <p className="italic m-0 text-sm">(lần thứ {data.times || "................."})</p>
            </div>
            <div className="w-[30%] text-right text-xs">
                    <p className="m-0 font-bold">MS: 08/BV-02</p>
                    <p className="m-0">Số: {data.xrayNumber || "................"}</p>
            </div>
        </div>

        <div className="mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="w-1/2">Họ tên người bệnh: <b className="font-bold uppercase">{data.patientName}</b></span>
                <span className="w-1/4">Tuổi: {data.age}</span>
                <span className="w-1/4 text-right">Nam/Nữ: {data.gender}</span>
            </div>
            <p className="m-0">Địa chỉ: {data.address}</p>
            <div className="flex justify-between">
                <span className="w-1/2">Khoa: {data.department}</span>
                <span className="w-1/4">Buồng: {data.room}</span>
                <span className="w-1/4 text-right">Giường: {data.bed}</span>
            </div>
            <p className="m-0">Chẩn đoán: {data.diagnosis}</p>
        </div>

        <div className="mb-6 border border-gray-300 rounded-sm">
                <div className="bg-gray-50 border-b border-gray-300 p-2 font-bold text-left text-gray-700 uppercase text-xs">Yêu cầu chiếu/ chụp</div>
                <div className="p-4 min-h-[100px] whitespace-pre-wrap text-sm">{data.request}</div>
        </div>

        <div className="flex justify-end mb-8">
            <div className="text-center w-1/3">
                <p className="italic m-0 text-sm">Ngày {data.requestDateDay} tháng {data.requestDateMonth} năm {data.requestDateYear}</p>
                <p className="font-bold mt-1 mb-0 uppercase text-xs">Bác sĩ điều trị</p>
                <div className="h-16"></div>
                <p className="m-0 font-bold uppercase text-sm">{data.doctor}</p>
            </div>
        </div>

        {showResultSection && (
            <>
            <div className="mb-6 border border-gray-300 rounded-sm">
                <div className="bg-gray-50 border-b border-gray-300 p-2 font-bold text-left text-gray-700 uppercase text-xs">Kết quả chiếu/ chụp</div>
                <div className="p-4 min-h-[150px] whitespace-pre-wrap text-sm font-bold">{data.result}</div>
            </div>

            <div className="flex justify-between items-start">
                <div className="w-1/2 pr-4">
                    <p className="font-bold underline mb-2 text-sm">Lời dặn của BS chuyên khoa:</p>
                    <p className="whitespace-pre-wrap m-0 italic text-sm">{data.advice}</p>
                </div>
                <div className="text-center w-1/3">
                    <p className="italic m-0 text-sm">Ngày {data.resultDateDay} tháng {data.resultDateMonth} năm {data.resultDateYear}</p>
                    <p className="font-bold mt-1 mb-0 uppercase text-xs">Bác sĩ chuyên khoa</p>
                    <div className="h-16"></div>
                    <p className="m-0 font-bold uppercase text-sm">{data.specialist}</p>
                </div>
            </div>
            </>
        )}
    </div>
  );
};

interface HematologyResultViewProps {
  data: HematologyData;
}

export const HematologyResultView = ({ data }: HematologyResultViewProps) => {
  const showResult = data.status === 3;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-8 print:shadow-none print:border-none">
        <div className="flex justify-between items-start mb-6">
            <div className="w-[30%] text-xs text-left">
                <p className="font-bold mb-1">BỆNH VIỆN VĂN LANG</p>
                <p>Khoa: {data.department || "..................."}</p>
            </div>
            <div className="w-[40%] text-center">
                <h1 className="text-lg font-bold uppercase m-0 text-vlu-red">Phiếu xét nghiệm huyết học</h1>
                <p className="text-xs mt-1">(Dùng cho các loại XN Huyết học)</p>
            </div>
            <div className="w-[30%] text-right text-xs">
                    <p className="m-0 font-bold uppercase">MS: 17/BV-01</p>
                    <p className="m-0 italic">Số phiếu: {data.id || "............"}</p>
            </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-y-2 text-sm">
            <div className="col-span-2 flex justify-between">
                <span>- Họ tên người bệnh: <b className="font-bold uppercase">{data.patientName}</b></span>
                <span>Tuổi: {data.age}</span>
                <span>Nam/Nữ: {data.gender}</span>
            </div>
            <div className="col-span-2">- Địa chỉ: {data.address}</div>
            <div>- Số thẻ BHYT: {data.insuranceNumber || "..................."}</div>
            <div className="text-right">- Chẩn đoán: {data.diagnosis}</div>
        </div>

        <div className="mb-6 border border-gray-800">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 border-b border-gray-800">
                        <th className="border-r border-gray-800 p-2 text-left text-xs uppercase w-[40%]">Tên xét nghiệm</th>
                        <th className="border-r border-gray-800 p-2 text-center text-xs uppercase w-[30%]">Kết quả</th>
                        <th className="p-2 text-center text-xs uppercase w-[30%]">Trị số bình thường</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {data.check_rbc && (
                        <tr className="border-b border-gray-800">
                            <td className="border-r border-gray-800 p-2">Số lượng Hồng cầu (RBC)</td>
                            <td className="border-r border-gray-800 p-2 text-center font-bold">{data.rbc}</td>
                            <td className="p-2 text-center text-xs">Nam: 4.2-5.4 / Nữ: 4.0-4.9 T/L</td>
                        </tr>
                    )}
                    {data.check_wbc && (
                        <tr className="border-b border-gray-800">
                            <td className="border-r border-gray-800 p-2">Số lượng Bạch cầu (WBC)</td>
                            <td className="border-r border-gray-800 p-2 text-center font-bold">{data.wbc}</td>
                            <td className="p-2 text-center text-xs">4.0 - 10.0 G/L</td>
                        </tr>
                    )}
                    {data.check_hgb && (
                        <tr className="border-b border-gray-800">
                            <td className="border-r border-gray-800 p-2">Huyết sắc tố (HGB)</td>
                            <td className="border-r border-gray-800 p-2 text-center font-bold">{data.hgb}</td>
                            <td className="p-2 text-center text-xs">Nam: 130-160 / Nữ: 120-142 g/L</td>
                        </tr>
                    )}
                     {data.check_plt && (
                        <tr className="border-b border-gray-800">
                            <td className="border-r border-gray-800 p-2">Số lượng Tiểu cầu (PLT)</td>
                            <td className="border-r border-gray-800 p-2 text-center font-bold">{data.plt}</td>
                            <td className="p-2 text-center text-xs">150 - 400 G/L</td>
                        </tr>
                    )}
                    {/* Add more rows based on check_ fields if needed */}
                </tbody>
            </table>
        </div>

        <div className="flex justify-between items-start mt-8">
            <div className="text-center w-1/3">
                <p className="font-bold uppercase text-xs mb-8">Bác sĩ điều trị</p>
                <div className="h-16"></div>
                <p className="font-bold uppercase text-sm">{data.doctor}</p>
            </div>
            <div className="text-center w-1/3">
                <p className="italic text-xs mb-1">Ngày {data.resultDateDay} tháng {data.resultDateMonth} năm {data.resultDateYear}</p>
                <p className="font-bold uppercase text-xs mb-8">Trưởng khoa xét nghiệm</p>
                <div className="h-16"></div>
                <p className="font-bold uppercase text-sm">{data.technician}</p>
            </div>
        </div>
    </div>
  );
};

interface AttachmentResultViewProps {
    path: string;
    name: string;
}

export const AttachmentResultView = ({ path, name }: AttachmentResultViewProps) => {
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(path.split('?')[0]);
    const isPdf = /\.pdf/i.test(path.split('?')[0]);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-8 overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-gray-700 font-bold border-b pb-2">
                <FileText size={18} className="text-vlu-red" />
                <span>{name}</span>
            </div>
            <div className="flex justify-center bg-gray-50 rounded-md p-4 min-h-[200px] items-center">
                {isImage ? (
                    <img src={path} alt={name} className="max-w-full h-auto shadow-md rounded-sm" />
                ) : isPdf ? (
                    <div className="flex flex-col items-center gap-4 py-10">
                         <div className="p-6 bg-red-50 rounded-full">
                            <FileText size={48} className="text-red-500" />
                         </div>
                         <p className="text-gray-600 font-medium">Tài liệu PDF: {name}</p>
                         <a href={path} target="_blank" rel="noreferrer" className="px-6 py-2 bg-vlu-red text-white rounded-lg hover:bg-red-800 transition-colors font-bold shadow-md">
                            Xem tài liệu đầy đủ (Mở trong tab mới)
                         </a>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 py-10">
                         <FileText size={48} className="text-gray-400" />
                         <p className="text-gray-600">Tài liệu đính kèm: {name}</p>
                         <a href={path} target="_blank" rel="noreferrer" className="text-vlu-red underline font-bold">Tải về / Xem</a>
                    </div>
                )}
            </div>
        </div>
    );
};
