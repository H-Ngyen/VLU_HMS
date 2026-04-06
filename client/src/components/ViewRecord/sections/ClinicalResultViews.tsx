import { FileText } from "lucide-react";
import type { XRayData } from "../../EditRecord/sections/XRayInputForm";
import type { HematologyData } from "../../EditRecord/sections/HematologyInputForm";

interface XRayResultViewProps {
  data: XRayData;
}

export const XRayResultView = ({ data }: XRayResultViewProps) => {
  const showResultSection = data.status >= 2 || data.status === 3;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-8 overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-gray-700 font-bold border-b pb-2">
          <FileText size={18} className="text-vlu-red" />
          <span>Phiếu Chiếu/ Chụp X-Quang - Lần {data.times || 1}</span>
      </div>
      <div className="flex justify-center bg-gray-50 rounded-md p-4 min-h-[300px] items-start">
        <div className="w-full max-w-[800px] bg-white shadow-md p-[10mm] text-black font-serif text-[10pt] leading-[1.4] border border-gray-200">
            <div className="flex justify-between items-start mb-5">
                <div className="w-[30%]">
                    <p className="m-0">Sở Y tế: {data.healthDept || "..................."}</p>
                    <p className="m-0">BV: {data.hospital || "..................."}</p>
                </div>
                <div className="w-[40%] text-center">
                    <h1 className="text-[10pt] font-bold uppercase m-0">Phiếu chiếu/ chụp X-Quang</h1>
                    <p className="italic m-0 text-[9pt]">(lần thứ {data.times || "................."})</p>
                </div>
                <div className="w-[30%] text-right">
                     <p className="m-0 font-bold">MS: 08/BV-02</p>
                     <p className="m-0">Số: {data.xrayNumber || "................"}</p>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between mb-2">
                    <span className="w-1/2">Họ tên người bệnh: <b className="font-bold uppercase">{data.patientName}</b></span>
                    <span className="w-1/4">Tuổi: {data.age}</span>
                    <span className="w-1/4 text-right">Nam/Nữ: {data.gender}</span>
                </div>
                <p className="m-0 mb-2">Địa chỉ: {data.address}</p>
                <div className="flex justify-between mb-2">
                    <span className="w-1/2">Khoa: {data.department}</span>
                    <span className="w-1/4">Buồng: {data.room}</span>
                    <span className="w-1/4 text-right">Giường: {data.bed}</span>
                </div>
                <p className="m-0">Chẩn đoán: {data.diagnosis}</p>
            </div>

            <div className="mb-6 border border-black">
                 <div className="bg-white border-b border-black p-2 font-bold text-left text-black">Yêu cầu chiếu/ chụp</div>
                 <div className="p-2 min-h-[30mm] whitespace-pre-wrap text-black">{data.request}</div>
            </div>

            <div className="flex justify-end mb-8">
                <div className="text-center w-1/3">
                    <p className="italic m-0">Ngày {data.requestDateDay} tháng {data.requestDateMonth} năm {data.requestDateYear}</p>
                    <p className="font-bold mt-1 mb-0 uppercase">Bác sĩ điều trị</p>
                    <div className="h-[20mm]"></div>
                    <p className="m-0 font-bold uppercase">{data.doctor}</p>
                </div>
            </div>

            {showResultSection && (
              <>
                <div className="mb-6 border border-black">
                    <div className="bg-white border-b border-black p-2 font-bold text-left text-black">Kết quả chiếu/ chụp</div>
                    <div className="p-2 min-h-[40mm] whitespace-pre-wrap text-black font-bold">{data.result}</div>
                </div>

                <div className="flex justify-between items-start">
                    <div className="w-1/2 pr-4">
                        <p className="font-bold underline mb-2">Lời dặn của BS chuyên khoa:</p>
                        <p className="whitespace-pre-wrap m-0 italic">{data.advice}</p>
                    </div>
                    <div className="text-center w-1/3">
                        <p className="italic m-0">Ngày {data.resultDateDay} tháng {data.resultDateMonth} năm {data.resultDateYear}</p>
                        <p className="font-bold mt-1 mb-0 uppercase">Bác sĩ chuyên khoa</p>
                        <div className="h-[20mm]"></div>
                        <p className="m-0 font-bold uppercase">{data.specialist}</p>
                    </div>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

interface HematologyResultViewProps {
  data: HematologyData;
}

export const HematologyResultView = ({ data }: HematologyResultViewProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-8 overflow-hidden">
        <div className="flex items-center gap-2 mb-4 text-gray-700 font-bold border-b pb-2">
            <FileText size={18} className="text-vlu-red" />
            <span>Phiếu Xét Nghiệm Huyết Học</span>
        </div>
        <div className="flex justify-center bg-gray-50 rounded-md p-4 min-h-[300px] items-start">
            <div className="w-full max-w-[800px] bg-white shadow-md p-[10mm] text-black font-serif text-[11pt] leading-[1.2] border border-gray-200">
                {/* Header */}
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ width: '30%' }}>
                        <p style={{ margin: 0 }}>Sở Y tế: {data.healthDept}</p>
                        <p style={{ margin: 0 }}>BV: {data.hospital}</p>
                    </div>
                    <div style={{ width: '40%', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '13pt', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Phiếu Xét Nghiệm</h1>
                        <h2 style={{ fontSize: '13pt', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Huyết Học</h2>
                    </div>
                    <div style={{ width: '30%', textAlign: 'right' }}>
                         <p style={{ margin: 0, fontWeight: 'bold' }}>MS: 17/BV-02</p>
                         <p style={{ margin: 0 }}>Số: {data.testNumber}</p>
                    </div>
                </div>

                <div style={{ marginTop: '5px', marginBottom: '10px', fontSize: '10pt' }}>
                     <span style={{ marginRight: '30px' }}>
                        <span style={{ verticalAlign: 'middle' }}>Thường: </span>
                        <span style={{ border: '1px solid #000', width: '14px', height: '14px', display: 'inline-block', textAlign: 'center', lineHeight: '12px', fontSize: '12px', verticalAlign: 'middle', marginLeft: '5px' }}>
                            {data.isEmergency ? '' : 'x'}
                        </span>
                     </span>
                     <span>
                        <span style={{ verticalAlign: 'middle' }}>Cấp cứu: </span>
                        <span style={{ border: '1px solid #000', width: '14px', height: '14px', display: 'inline-block', textAlign: 'center', lineHeight: '12px', fontSize: '12px', verticalAlign: 'middle', marginLeft: '5px' }}>
                            {data.isEmergency ? 'x' : ''}
                        </span>
                     </span>
                </div>

                {/* Patient Info */}
                <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <div style={{ flex: 1 }}>- Họ tên người bệnh: <b style={{ textTransform: 'uppercase' }}>{data.patientName}</b></div>
                        <div style={{ width: '15%' }}>Tuổi: {data.age}</div>
                        <div style={{ width: '15%', textAlign: 'right' }}>Nam/Nữ: {data.gender}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <div style={{ flex: 1 }}>- Địa chỉ: {data.address}</div>
                        <div style={{ width: '40%' }}>Số thẻ BHYT: {data.insuranceNumber}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <div style={{ flex: 1 }}>- Khoa: {data.department}</div>
                        <div style={{ width: '25%' }}>Buồng: {data.room}</div>
                        <div style={{ width: '25%', textAlign: 'right' }}>Giường: {data.bed}</div>
                    </div>
                    <div>- Chẩn đoán: {data.diagnosis}</div>
                </div>

                {/* Content Body - Table Layout for PDF */}
                <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>1. Tế bào máu ngoại vi:</div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', border: '1px solid black' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'left', width: '30%' }}>Chỉ số</th>
                            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center', width: '20%' }}>Kết quả</th>
                            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'left', width: '30%' }}>Chỉ số</th>
                            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center', width: '20%' }}>Kết quả</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            // Row 1
                            { 
                                l1: { l: "Số lượng HC", s: "nam (4,0-5,8); nữ (3,9-5,4 x10^12/l)", c: data.check_rbc }, v1: data.rbc,
                                l2: { l: "Số lượng BC", s: "(4-10 x 10^9/l)", c: data.check_wbc }, v2: data.wbc
                            },
                            // Row 2
                            { 
                                l1: { l: "Huyết sắc tố", s: "nam (140-160); nữ (125-145 g/l)", c: data.check_hgb }, v1: data.hgb,
                                l2: { type: 'header', l: "Thành phần bạch cầu (%):" }, v2: null
                            },
                            // Row 3
                            { 
                                l1: { l: "Hematocrit", s: "nam (0,38-0,50); nữ (0,35-0,47 l/l)", c: data.check_hct }, v1: data.hct,
                                l2: { l: "- Đoạn trung tính", c: null, indent: true }, v2: data.neutrophils
                            },
                            // Row 4
                            { 
                                l1: { l: "MCV", s: "(83-92 fl)", c: data.check_mcv }, v1: data.mcv,
                                l2: { l: "- Đoạn ưa a xít", c: null, indent: true }, v2: data.eosinophils
                            },
                            // Row 5
                            { 
                                l1: { l: "MCH", s: "(27-32 pg)", c: data.check_mch }, v1: data.mch,
                                l2: { l: "- Đoạn ưa ba zơ", c: null, indent: true }, v2: data.basophils
                            },
                            // Row 6
                            { 
                                l1: { l: "MCHC", s: "(320-356 g/l)", c: data.check_mchc }, v1: data.mchc,
                                l2: { l: "- Mono", c: null, indent: true }, v2: data.monocytes
                            },
                            // Row 7
                            { 
                                l1: { l: "Hồng cầu có nhân", s: "(0 x 10^9/l)", c: data.check_nrbc }, v1: data.nrbc,
                                l2: { l: "- Lympho", c: null, indent: true }, v2: data.lymphocytes
                            },
                            // Row 8
                            { 
                                l1: { l: "Hồng cầu lưới", s: "(0,1-0,5 %)", c: data.check_reticulocytes }, v1: data.reticulocytes,
                                l2: { l: "- Tế bào bất thường", c: null, indent: true }, v2: data.abnormalCells
                            },
                            // Row 9
                            { 
                                l1: null, v1: null,
                                l2: { l: "Số lượng tiểu cầu", s: "(150-400 x10^9/l)", c: data.check_plt }, v2: data.plt
                            },
                            // Row 10 (ESR special case)
                            { 
                                l1: null, v1: null,
                                l2: { type: 'esr', l: "Máu lắng", c: data.check_esr }, v2: { v1: (data as any).esr1, v2: (data as any).esr2 }
                            },
                            // Row 11
                            { 
                                l1: null, v1: null,
                                l2: { l: "KSV sốt rét", c: data.check_malaria }, v2: data.malaria
                            },
                        ].map((row, idx) => (
                            <tr key={idx}>
                                {/* Left Side */}
                                <td style={{ border: '1px solid black', padding: '4px', verticalAlign: 'middle' }}>
                                    {row.l1 && (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ fontSize: '12pt', marginRight: '5px' }}>●</span>
                                            <div style={{ display: 'inline-block' }}>
                                                <span style={{ verticalAlign: 'middle' }}>{row.l1.l}</span>
                                                {row.l1.s && <div style={{ fontSize: '9pt', fontStyle: 'italic', color: '#444' }}>{row.l1.s}</div>}
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td style={{ border: '1px solid black', padding: '4px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle' }}>
                                    {row.v1}
                                </td>

                                {/* Right Side */}
                                <td style={{ border: '1px solid black', padding: '4px', verticalAlign: 'middle' }}>
                                    {row.l2 && (
                                        <>
                                            {row.l2.type === 'header' ? (
                                                <div style={{ fontStyle: 'italic' }}>{row.l2.l}</div>
                                            ) : row.l2.type === 'esr' ? (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '12pt', marginRight: '5px' }}>●</span>
                                                    <div style={{ display: 'inline-block' }}>
                                                        <span style={{ verticalAlign: 'middle' }}>{row.l2.l}</span>
                                                        <div style={{ fontSize: '9pt', fontStyle: 'italic' }}>giờ 1 (&lt; 15 mm)</div>
                                                        <div style={{ fontSize: '9pt', fontStyle: 'italic' }}>giờ 2 (&lt; 20 mm)</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: row.l2.indent ? '20px' : '0' }}>
                                                    {!row.l2.indent && <span style={{ fontSize: '12pt', marginRight: '5px' }}>●</span>}
                                                    <span style={{ verticalAlign: 'middle' }}>{row.l2.l}</span>
                                                </div>
                                            )}
                                            {row.l2.s && <div style={{ fontSize: '9pt', fontStyle: 'italic', color: '#444', marginLeft: '20px' }}>{row.l2.s}</div>}
                                        </>
                                    )}
                                </td>
                                <td style={{ border: '1px solid black', padding: '4px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle' }}>
                                    {row.l2?.type === 'esr' && typeof row.v2 === 'object' && row.v2 ? (
                                        <>
                                            <div style={{ marginBottom: '5px' }}>{(row.v2 as any).v1}</div>
                                            <div>{(row.v2 as any).v2}</div>
                                        </>
                                    ) : (
                                        row.v2 as React.ReactNode
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Section 2 & 3 - Side by Side */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '50%', verticalAlign: 'top', border: 'none', paddingRight: '10px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>2. Đông máu:</div>
                                <div style={{ paddingLeft: '5px' }}>
                                    <div style={{ marginBottom: '5px' }}>
                                        <span style={{ fontSize: '12pt', marginRight: '5px' }}>●</span>
                                        <span style={{ verticalAlign: 'middle' }}>Thời gian máu chảy: ...........{data.bleedingTime}......... phút ............</span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '12pt', marginRight: '5px' }}>●</span>
                                        <span style={{ verticalAlign: 'middle' }}>Thời gian máu đông: ...........{data.clottingTime}......... phút ............</span>
                                    </div>
                                </div>
                            </td>
                            <td style={{ width: '50%', verticalAlign: 'top', border: 'none', paddingLeft: '10px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>3. Nhóm máu:</div>
                                <div style={{ paddingLeft: '5px' }}>
                                    <div style={{ marginBottom: '5px' }}>
                                        <span style={{ fontSize: '12pt', marginRight: '5px' }}>●</span>
                                        <span style={{ verticalAlign: 'middle', marginRight: '5px' }}>Hệ ABO: <b>{data.bloodGroupABO}</b></span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '12pt', marginRight: '5px' }}>●</span>
                                        <span style={{ verticalAlign: 'middle', marginRight: '5px' }}>Hệ Rh: <b>{data.bloodGroupRh}</b></span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Footer Signatures */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt' }}>
                    <div style={{ textAlign: 'center', width: '45%' }}>
                        <div>Ngày {data.requestDateDay} tháng {data.requestDateMonth} năm {data.requestDateYear}</div>
                        <div style={{ fontWeight: 'bold', textTransform: 'uppercase', marginTop: '5px' }}>Bác sĩ điều trị</div>
                        <div style={{ height: '25mm' }}></div>
                        <div>Họ tên: <b>{data.doctor}</b></div>
                    </div>
                    <div style={{ textAlign: 'center', width: '45%' }}>
                        <div>Ngày {data.resultDateDay} tháng {data.resultDateMonth} năm {data.resultDateYear}</div>
                        <div style={{ fontWeight: 'bold', textTransform: 'uppercase', marginTop: '5px' }}>Trưởng khoa xét nghiệm</div>
                        <div style={{ height: '25mm' }}></div>
                        <div>Họ tên: <b>{data.technician}</b></div>
                    </div>
                </div>
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
            <div className="flex justify-center bg-gray-50 rounded-md p-2 min-h-[300px] items-start">
                {isImage ? (
                    <img src={path} alt={name} className="max-w-full h-auto shadow-md rounded-sm" />
                ) : isPdf ? (
                    <div className="w-full h-[800px] border border-gray-300 rounded-sm overflow-hidden bg-white shadow-inner">
                        <iframe 
                            src={`${path}#toolbar=0&navpanes=0`} 
                            title={name} 
                            className="w-full h-full border-none"
                        />
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
