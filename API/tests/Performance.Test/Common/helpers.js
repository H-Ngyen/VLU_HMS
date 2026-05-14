export function generateValidPatientPayload() {
    // Name: Only uppercase letters and spaces, max 100 chars
    const firstNames = ["NGUYEN", "TRAN", "LE", "PHAM", "HOANG", "HUYNH", "PHAN", "VU", "VO", "DANG"];
    const middleNames = ["VAN", "THI", "HOANG", "MINH", "QUANG", "HUU", "DUC", "NGOC"];
    const lastNames = ["ANH", "BINH", "CUONG", "DUNG", "EM", "PHUC", "GIANG", "HAI", "LINH", "KHOA"];
    
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

    // DateOfBirth: Between 150 years ago and today
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 100; // Let's keep it around 100 years old maximum
    const maxYear = currentYear - 1;
    const birthYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1; // Safe day (max 28 to avoid leap year validation issues)
    
    const dateOfBirth = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}T00:00:00Z`;

    // HealthInsuranceNumber: 2 uppercase letters + 13 digits
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const prefix = letters.charAt(Math.floor(Math.random() * letters.length)) + letters.charAt(Math.floor(Math.random() * letters.length));
    let digits = "";
    for(let i = 0; i < 13; i++) {
        digits += Math.floor(Math.random() * 10).toString();
    }
    const healthInsuranceNumber = prefix + digits;

    // EthnicityId: 1 to 56
    const ethnicityId = Math.floor(Math.random() * 56) + 1;

    // Gender: 1 (Male), 2 (Female), or 3 (Other)
    const gender = Math.floor(Math.random() * 3) + 1;

    return {
        name: name,
        dateOfBirth: dateOfBirth,
        gender: gender,
        ethnicityId: ethnicityId,
        healthInsuranceNumber: healthInsuranceNumber
    };
}

export function generateValidMedicalRecordPayload() {
    return {
        recordType: Math.floor(Math.random() * 2) + 1, // 1: Internal, 2: Surgical
        formCode: `FC${Math.floor(Math.random() * 10000)}`,
        medicalCode: `MC${Math.floor(Math.random() * 10000)}`,
        bedCode: `B${Math.floor(Math.random() * 100)}`,
        jobTitle: "Nhân viên văn phòng",
        jobTitleCode: "NV01",
        addressJob: "TP.HCM",
        address: "123 Đường ABC, Quận XYZ",
        provinceCode: 79, // Example code
        districtCode: 760, // Example code
        provinceName: "Hồ Chí Minh",
        districtName: "Quận 1",
        wardName: "Phường Bến Nghé",
        healthInsuranceExpiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        relativeInfo: "Nguyen Van A",
        relativePhone: "0123456789",
        paymentCategory: Math.floor(Math.random() * 4) + 1, // 1 to 4
        admissionTime: new Date().toISOString(),
        admissionType: Math.floor(Math.random() * 3) + 1, // 1 to 3
        referralSource: 1, 
        admissionCount: Math.floor(Math.random() * 10).toString(), // Must be non-negative integer string
        totalTreatmentDays: Math.floor(Math.random() * 30).toString(), // Must be non-negative integer string
        referralDiagnosis: "Đau bụng",
        admissionDiagnosis: "Viêm ruột thừa",
        departmentDiagnosis: "Viêm ruột thừa cấp",
        hasProcedure: false,
        hasSurgery: true,
        dischargeMainDiagnosis: "Viêm ruột thừa cấp",
        hasAccident: false,
        hasComplication: false,
        treatmentResult: 1, // Assumed ENUM value
        departmentTransfers: [],
        detail: {
           // Provide basic empty details or mock based on requirements if needed
        }
    };
}

export function getRandomAllowedPageSize() {
    const allowPageSizes = [5, 10, 15, 20, 25, 30, 35, 40];
    return allowPageSizes[Math.floor(Math.random() * allowPageSizes.length)];
    return 20;
}

export function getRandomSearchPhrase() {
    const phrases = ["NGUYEN", "TRAN", "LE", "PHAM", "HOANG", "HUYNH", "PHAN", "VU", "VO", "DANG"];
    return phrases[Math.floor(Math.random() * phrases.length)];
}

export function extractIdsFromPagedResult(response) {
    try {
        const body = JSON.parse(response.body);
        if (body && body.items && Array.isArray(body.items)) {
            return body.items.map(item => item.id);
        }
    } catch (e) {
        console.error("Failed to parse paged result body", e);
    }
    return [];
}

export function thinkTimeRandom(min = 1, max = 5) {
  sleep(Math.random() * (max - min) + min);
}