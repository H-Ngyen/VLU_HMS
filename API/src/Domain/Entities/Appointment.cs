using Domain.Enums;

namespace Domain.Entities;

public class Appointment
{
    public int Id { get; set; }

    // Foreign Keys
    public required int PatientId { get; set; }
    public required int DoctorId { get; set; }

    // Properties
    public required DateTime AppointmentDate { get; set; }
    public required TimeSpan StartTime { get; set; }
    public required TimeSpan EndTime { get; set; }
    public required string Reason { get; set; }
    public required AppointmentStatus Status { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public Patient Patient { get; set; } = null!;
    public User Doctor { get; set; } = null!;
}
