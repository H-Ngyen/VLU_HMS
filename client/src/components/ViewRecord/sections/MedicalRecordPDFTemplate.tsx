import React from "react";
import type { Record as MedicalRecord, Patient } from "@/types";

interface Props {
  record: MedicalRecord;
  patient: Patient;
}

export const MedicalRecordPDFTemplate: React.FC<Props> = ({ record, patient }) => {
  const parseDateToParts = (dateString?: string) => {
    if (!dateString) return { day: "...", month: "...", year: "....", time: "..." };
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return { day: "...", month: "...", year: "....", time: "..." };
      return {
        day: d.getDate().toString().padStart(2, "0"),
        month: (d.getMonth() + 1).toString().padStart(2, "0"),
        year: d.getFullYear().toString(),
        time: `${d.getHours().toString().padStart(2, "0")} Giờ ${d.getMinutes().toString().padStart(2, "0")} phút`,
      };
    } catch {
      return { day: "...", month: "...", year: "....", time: "..." };
    }
  };

  const adParts = parseDateToParts(record.admissionDate);
  const disParts = parseDateToParts(record.dischargeDate);
  
  const mData = record.managementData || {};
  const totalDays = mData.transfers?.reduce((acc, t) => acc + (Number(t.days) || 0), 0) || 0;
  const cData = record.medicalRecordContent || {};
  const dInfo = record.diagnosisInfo || {};
  const dsInfo = record.dischargeStatusInfo || {};

  const pageStyle: React.CSSProperties = {
    width: "210mm",
    minHeight: "297mm",
    padding: "10mm 15mm",
    backgroundColor: "white",
    color: "black",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "11pt",
    lineHeight: "1.4",
    boxSizing: "border-box",
    position: "relative",
    pageBreakAfter: "always",
  };

  const cellStyle: React.CSSProperties = {
    border: "1px solid black",
    padding: "4px",
    verticalAlign: "top",
  };

  const getGenderCheck = (g: string | number) => {
    if (g === 1 || g === "Nam") return [true, false];
    if (g === 2 || g === "Nữ") return [false, true];
    return [false, false];
  };
  const [isMale, isFemale] = getGenderCheck(patient.gender);

  return (
    <div className="pdf-container">
      {/* PAGE 1 */}
      <div style={pageStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
          <div style={{ width: "40%" }}>
            <div style={{ textTransform: "uppercase" }}>SỞ Y TẾ ...................</div>
            <div style={{ textTransform: "uppercase", fontWeight: "bold" }}>BỆNH VIỆN ...................</div>
            <div>Khoa: {record.department}</div>
          </div>
          <div style={{ width: "40%", textAlign: "center" }}>
            <h1 style={{ fontSize: "16pt", fontWeight: "bold", margin: "10px 0" }}>BỆNH ÁN {record.type === "surgery" ? "NGOẠI KHOA" : "NỘI KHOA"}</h1>
          </div>
          <div style={{ width: "20%", fontSize: "10pt", textAlign: "right" }}>
            <div>Số lưu trữ: {record.id}</div>
            <div>Mã YT: ..................</div>
          </div>
        </div>

        {/* I. HÀNH CHÍNH */}
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>I. HÀNH CHÍNH:</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px", border: "none" }}>
          <tbody>
            <tr>
              <td colSpan={2}>1. Họ và tên: <b style={{ textTransform: "uppercase" }}>{patient.name}</b></td>
              <td>2. Sinh ngày: {patient.dob}</td>
              <td>Tuổi: {patient.age}</td>
            </tr>
            <tr>
              <td>3. Giới tính: 1.Nam <span style={{display:"inline-block", width:"12px", border:"1px solid black", textAlign:"center"}}>{isMale?"X":""}</span> 2.Nữ <span style={{display:"inline-block", width:"12px", border:"1px solid black", textAlign:"center"}}>{isFemale?"X":""}</span></td>
              <td colSpan={3}>4. Nghề nghiệp: {patient.job || ""}</td>
            </tr>
            <tr>
              <td colSpan={2}>5. Dân tộc: .................</td>
              <td colSpan={2}>6. Ngoại kiều: .................</td>
            </tr>
            <tr>
              <td colSpan={4}>7. Địa chỉ: {patient.address}</td>
            </tr>
            <tr>
              <td colSpan={4}>8. Nơi làm việc: {patient.workplace || ""}</td>
            </tr>
            <tr>
              <td colSpan={4}>9. Đối tượng: 1.BHYT 2.Thu phí 3.Miễn 4.Khác <span style={{ marginLeft: "20px" }}>Số thẻ BHYT: {patient.insuranceNumber || patient.healthInsuranceNumber}</span></td>
            </tr>
            <tr>
              <td colSpan={4}>10. Họ tên, địa chỉ người nhà cần báo tin: {patient.relativeInfo || ""} {patient.relativePhone ? ` - ĐT: ${patient.relativePhone}` : ""}</td>
            </tr>
          </tbody>
        </table>

        {/* II. QUẢN LÝ NGƯỜI BỆNH */}
        <div style={{ fontWeight: "bold", marginBottom: "5px", backgroundColor: "#e5e7eb", padding: "2px 5px", borderTop: "1px solid black", borderBottom: "1px solid black" }}>II. QUẢN LÝ NGƯỜI BỆNH</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px", border: "1px solid black" }}>
          <tbody>
            <tr>
              <td style={cellStyle} colSpan={2}>
                11. Vào viện: {adParts.time} ngày {adParts.day}/{adParts.month}/{adParts.year}
              </td>
              <td style={cellStyle}>
                12. Nơi giới thiệu: ...................
              </td>
            </tr>
            <tr>
              <td style={cellStyle} colSpan={2}>
                13. Vào khoa: {record.department}
              </td>
              <td style={cellStyle}>
                14. Chuyển viện: ...................
              </td>
            </tr>
            <tr>
              <td style={cellStyle} colSpan={2}>
                15. Ra viện: {disParts.time} ngày {disParts.day}/{disParts.month}/{disParts.year}
              </td>
              <td style={cellStyle}>
                Tổng số ngày điều trị: {totalDays}
              </td>
            </tr>
          </tbody>
        </table>

        {/* III. CHẨN ĐOÁN */}
        <div style={{ fontWeight: "bold", marginBottom: "5px", backgroundColor: "#e5e7eb", padding: "2px 5px", borderTop: "1px solid black", borderBottom: "1px solid black" }}>III. CHẨN ĐOÁN</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px", border: "1px solid black" }}>
          <tbody>
            <tr>
              <td style={{ ...cellStyle, width: "50%" }}>
                16. Nơi chuyển đến: {dInfo.transferDiagnosis?.name || ""}
              </td>
              <td style={{ ...cellStyle, width: "50%" }} rowSpan={3}>
                19. Ra viện:<br />
                + Bệnh chính: <b>{dInfo.dischargeDiagnosis?.mainDisease?.name || ""}</b> (Mã: {dInfo.dischargeDiagnosis?.mainDisease?.code || ""})<br /><br />
                + Bệnh kèm theo: {dInfo.dischargeDiagnosis?.comorbidities?.name || ""} (Mã: {dInfo.dischargeDiagnosis?.comorbidities?.code || ""})<br /><br />
                + Biến chứng: {dInfo.dischargeDiagnosis?.isComplication ? "Có" : "Không"}
              </td>
            </tr>
            <tr>
              <td style={cellStyle}>
                17. KKB, Cấp cứu: {dInfo.kkbDiagnosis?.name || ""}
              </td>
            </tr>
            <tr>
              <td style={cellStyle}>
                18. Khi vào khoa điều trị: {dInfo.deptDiagnosis?.name || ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* IV. TÌNH TRẠNG RA VIỆN */}
        <div style={{ fontWeight: "bold", marginBottom: "5px", backgroundColor: "#e5e7eb", padding: "2px 5px", borderTop: "1px solid black", borderBottom: "1px solid black" }}>IV. TÌNH TRẠNG RA VIỆN</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px", border: "1px solid black" }}>
          <tbody>
            <tr>
              <td style={cellStyle} colSpan={2}>
                20. Kết quả điều trị: <b>{dsInfo.treatmentResult || ""}</b>
              </td>
              <td style={cellStyle} colSpan={2}>
                21. Tình hình tử vong: {dsInfo.deathStatus?.description || ""}
              </td>
            </tr>
            <tr>
              <td style={cellStyle} colSpan={2}>
                22. Giải phẫu bệnh: {dsInfo.pathology || ""}
              </td>
              <td style={cellStyle} colSpan={2}>
                23. Nguyên nhân tử vong: {dsInfo.mainCauseOfDeath?.name || ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer Page 1 */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", textAlign: "center" }}>
          <div style={{ width: "40%" }}>
            <div style={{ fontWeight: "bold", textTransform: "uppercase" }}>GIÁM ĐỐC BỆNH VIỆN</div>
          </div>
          <div style={{ width: "40%" }}>
            <div><i>Ngày {new Date().getDate()} tháng {new Date().getMonth()+1} năm {new Date().getFullYear()}</i></div>
            <div style={{ fontWeight: "bold", textTransform: "uppercase" }}>TRƯỞNG KHOA</div>
          </div>
        </div>
      </div>

      {/* PAGE 2 */}
      <div style={pageStyle}>
        <div style={{ textAlign: "right", fontWeight: "bold", marginBottom: "20px" }}>BỆNH ÁN</div>
        
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>A. BỆNH ÁN</div>
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>I. Lý do vào viện: <span style={{ fontWeight: "normal" }}>{cData.reason || ""}</span></div>
        <div style={{ marginBottom: "15px" }}>Vào ngày thứ ..... của bệnh.</div>

        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>II. Hỏi bệnh</div>
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>1. Quá trình bệnh lý:</div>
        <div style={{ marginBottom: "15px", whiteSpace: "pre-wrap", textAlign: "justify" }}>{cData.pathologicalProcess || ""}</div>

        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>2. Tiền sử bệnh:</div>
        <div style={{ marginBottom: "5px" }}>+ Bản thân:</div>
        <div style={{ marginBottom: "15px", whiteSpace: "pre-wrap" }}>{cData.personalHistory || ""}</div>
        <div style={{ marginBottom: "5px" }}>+ Gia đình:</div>
        <div style={{ marginBottom: "15px", whiteSpace: "pre-wrap" }}>{cData.familyHistory || ""}</div>

        <div style={{ fontWeight: "bold", marginBottom: "5px", marginTop: "20px" }}>III. Khám bệnh:</div>
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>1. Toàn thân:</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
          <div style={{ width: "65%", whiteSpace: "pre-wrap" }}>{cData.organs?.wholeBody || ""}</div>
          <div style={{ width: "30%", borderLeft: "1px dotted black", paddingLeft: "10px" }}>
            Mạch: {cData.vitalSigns?.pulse || "..."} lần/ph<br/>
            Nhiệt độ: {cData.vitalSigns?.temperature || "..."} °C<br/>
            Huyết áp: {cData.vitalSigns?.bloodPressure || "..."} mmHg<br/>
            Nhịp thở: {cData.vitalSigns?.respiratoryRate || "..."} lần/ph<br/>
            Cân nặng: {cData.vitalSigns?.weight || "..."} kg
          </div>
        </div>

        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>2. Các cơ quan:</div>
        <div style={{ marginBottom: "10px" }}>+ Tuần hoàn: <span style={{ whiteSpace: "pre-wrap" }}>{cData.organs?.circulatory || ""}</span></div>
        <div style={{ marginBottom: "10px" }}>+ Hô hấp: <span style={{ whiteSpace: "pre-wrap" }}>{cData.organs?.respiratory || ""}</span></div>
        <div style={{ marginBottom: "10px" }}>+ Tiêu hóa: <span style={{ whiteSpace: "pre-wrap" }}>{cData.organs?.digestive || ""}</span></div>
        <div style={{ marginBottom: "10px" }}>+ Thận - Tiết niệu - Sinh dục: <span style={{ whiteSpace: "pre-wrap" }}>{cData.organs?.kidneyUrologyGenital || ""}</span></div>
      </div>

      {/* PAGE 3 */}
      <div style={pageStyle}>
        <div style={{ marginBottom: "10px" }}>+ Thần kinh: <span style={{ whiteSpace: "pre-wrap" }}>{cData.organs?.neurological || ""}</span></div>
        <div style={{ marginBottom: "10px" }}>+ Cơ - Xương - Khớp: <span style={{ whiteSpace: "pre-wrap" }}>{cData.organs?.musculoskeletal || ""}</span></div>
        <div style={{ marginBottom: "10px" }}>+ Tai - Mũi - Họng: <span style={{ whiteSpace: "pre-wrap" }}>{cData.organs?.ent || ""}</span></div>
        <div style={{ marginBottom: "10px" }}>+ Răng - Hàm - Mặt: <span style={{ whiteSpace: "pre-wrap" }}>{cData.organs?.maxillofacial || ""}</span></div>
        <div style={{ marginBottom: "10px" }}>+ Mắt: <span style={{ whiteSpace: "pre-wrap" }}>{cData.organs?.eye || ""}</span></div>
        <div style={{ marginBottom: "15px" }}>+ Nội tiết, dinh dưỡng và các bệnh lý khác: <span style={{ whiteSpace: "pre-wrap" }}>{cData.organs?.endocrineNutritionOther || ""}</span></div>

        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>3. Các xét nghiệm cận lâm sàng cần làm:</div>
        <div style={{ marginBottom: "15px", whiteSpace: "pre-wrap" }}>{cData.clinicalTests || ""}</div>

        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>4. Tóm tắt bệnh án:</div>
        <div style={{ marginBottom: "15px", whiteSpace: "pre-wrap", textAlign: "justify" }}>{cData.summary || ""}</div>

        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>IV. Chẩn đoán khi vào khoa điều trị:</div>
        <div style={{ marginBottom: "15px" }}>
            + Bệnh chính: {cData.admissionDiagnosis?.mainDisease || ""}<br/>
            + Bệnh kèm theo: {cData.admissionDiagnosis?.comorbidities || ""}<br/>
            + Phân biệt: {cData.admissionDiagnosis?.differential || ""}
        </div>

        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>V. Tiên lượng:</div>
        <div style={{ marginBottom: "15px", whiteSpace: "pre-wrap" }}>{cData.prognosis || ""}</div>

        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>VI. Hướng điều trị:</div>
        <div style={{ marginBottom: "15px", whiteSpace: "pre-wrap" }}>{cData.treatmentPlan || ""}</div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "30px", textAlign: "center" }}>
          <div style={{ width: "40%" }}>
            <div><i>Ngày {new Date().getDate()} tháng {new Date().getMonth()+1} năm {new Date().getFullYear()}</i></div>
            <div style={{ fontWeight: "bold", textTransform: "uppercase" }}>Bác sĩ làm bệnh án</div>
          </div>
        </div>
      </div>
      {/* PAGE 4 */}
      <div style={pageStyle}>
        <div style={{ fontWeight: "bold", marginBottom: "20px", borderBottom: "1px solid black", paddingBottom: "5px" }}>TỔNG KẾT BỆNH ÁN</div>
        
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>1. Quá trình bệnh lý và diễn biến lâm sàng:</div>
        <div style={{ marginBottom: "15px", whiteSpace: "pre-wrap", textAlign: "justify" }}>{cData.pathologicalProcess || ""}</div>

        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>2. Tóm tắt kết quả xét nghiệm cận lâm sàng có giá trị chẩn đoán:</div>
        <div style={{ marginBottom: "15px", whiteSpace: "pre-wrap", textAlign: "justify" }}>{cData.clinicalTests || ""}</div>

        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>3. Phương pháp điều trị:</div>
        <div style={{ marginBottom: "15px", whiteSpace: "pre-wrap" }}>{cData.treatmentPlan || ""}</div>

        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>4. Tình trạng người bệnh ra viện:</div>
        <div style={{ marginBottom: "15px" }}>{dsInfo.treatmentResult || ""}</div>

        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>5. Hướng điều trị và các chế độ tiếp theo:</div>
        <div style={{ marginBottom: "25px", whiteSpace: "pre-wrap" }}>{cData.prognosis || ""}</div>

        {/* Table Hồ sơ phim ảnh */}
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black", fontSize: "10pt", textAlign: "center" }}>
          <thead>
            <tr>
              <th colSpan={2} style={cellStyle}>Hồ sơ, phim, ảnh</th>
              <th rowSpan={2} style={{ ...cellStyle, width: "30%" }}>Người giao hồ sơ:</th>
              <th rowSpan={2} style={{ ...cellStyle, width: "30%" }}>
                Ngày {new Date().getDate()} tháng {new Date().getMonth()+1} năm {new Date().getFullYear()}<br/>
                Bác sĩ điều trị
              </th>
            </tr>
            <tr>
              <th style={{ ...cellStyle, width: "30%" }}>Loại</th>
              <th style={{ ...cellStyle, width: "10%" }}>Số tờ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...cellStyle, textAlign: "left" }}>- X quang</td>
              <td style={cellStyle}></td>
              <td rowSpan={5} style={{ ...cellStyle, verticalAlign: "bottom", paddingBottom: "10px" }}>
                Họ tên: ...............................<br/><br/>
                <b>Người nhận hồ sơ:</b><br/><br/><br/><br/><br/>
                Họ tên: ...............................
              </td>
              <td rowSpan={5} style={{ ...cellStyle, verticalAlign: "bottom", paddingBottom: "10px" }}>
                <br/><br/><br/><br/><br/><br/>
                <b>{""}</b>
              </td>
            </tr>
            <tr>
              <td style={{ ...cellStyle, textAlign: "left" }}>- CT Scanner</td>
              <td style={cellStyle}></td>
            </tr>
            <tr>
              <td style={{ ...cellStyle, textAlign: "left" }}>- Siêu âm</td>
              <td style={cellStyle}></td>
            </tr>
            <tr>
              <td style={{ ...cellStyle, textAlign: "left" }}>- Xét nghiệm</td>
              <td style={cellStyle}></td>
            </tr>
            <tr>
              <td style={{ ...cellStyle, textAlign: "left" }}>- Khác....</td>
              <td style={cellStyle}></td>
            </tr>
            <tr>
              <td style={{ ...cellStyle, textAlign: "left" }}>- Toàn bộ hồ sơ</td>
              <td style={cellStyle}></td>
              <td colSpan={2} style={cellStyle}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
