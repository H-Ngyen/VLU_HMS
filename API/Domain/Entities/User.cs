namespace Domain.Entities;

public class User
{
    //PK
    public int Id { get; set; }
    //FK
    public required int RoleId { get; set; }
    public int? DepartmentId { get; set; }

    //Prop
    public required string Auth0Id { get; set; }
    public required string Email { get; set; }
    public bool EmailVerify { get; set; }

    public required string Name { get; set; }

    public required string PictureUrl { get; set; }

    public required DateTime CreateAt { get; set; }
    public required DateTime UpdateAt { get; set; }

    public bool Active { get; set; }

    // Navigation Properties
    public Role Role { get; set; } = null!;
    public Department? Department { get; set; }
    public ICollection<UserNotification> UserNotifications { get; set; } = [];
}