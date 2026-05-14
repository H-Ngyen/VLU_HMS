using Domain.Enums;

namespace Domain.Entities;

public class XRay
{
    public int Id { get; set; }

    // Foreign Key
    // Liên kết với Hồ sơ bệnh án
    public int MedicalRecordId { get; set; }
    public int RequestedById { get; set; }
    public int? PerformedById { get; set; }

    // Props
    public string? DepartmentOfHealth { get; set; }
    public string? HospitalName { get; set; }
    public string? FormNumber { get; set; }
    public string? RoomNumber { get; set; }
    // public string? BedNumber { get; set; }
    
    public MedicalStatus Status { get; set; }

    // --- Phần Yêu cầu (Request) ---
    public string? RequestDescription { get; set; }
    public DateOnly? RequestedAt { get; set; }

    // --- Phần Kết quả (Result) ---
    public string? ResultDescription { get; set; }
    public string? DoctorAdvice { get; set; }
    public DateOnly? CompletedAt { get; set; }

    // Navigation Properties
    public ICollection<XRayStatusLog> XRayStatusLogs { get; set; } = [];
    public MedicalRecord MedicalRecord { get; set; } = null!;
    public User? PerformedBy { get; set; } // Bác sĩ chuyên khoa X-Quang
    public User RequestedBy { get; set; } = null!; // Bác sĩ điều trị

    // public bool IsCompleted()
    // {
    //     return 
    //         !string.IsNullOrWhiteSpace(ResultDescription) &&
    //         !string.IsNullOrWhiteSpace(DoctorAdvice) &&
    //         CompletedAt.HasValue;
    // }

    public bool IsCompleted()
    {
        // Danh sách các trường cần bỏ qua (không phải kết quả xét nghiệm)
        var metadataProps = new[]
        {
            nameof(Id),
        };

        var properties = GetType().GetProperties();

        foreach (var prop in properties)
        {
            // 1. Bỏ qua các trường metadata, Navigation properties (Collection, Class)
            if (metadataProps.Contains(prop.Name) ||
                prop.PropertyType.IsGenericType ||
                (prop.PropertyType.IsClass && prop.PropertyType != typeof(string)))
                continue;

            // 2. Lấy giá trị
            var value = prop.GetValue(this);

            // 3. Kiểm tra null hoặc chuỗi rỗng
            if (value == null) return false;
            if (value is string s && string.IsNullOrWhiteSpace(s)) return false;
        }

        return true;
    }
}