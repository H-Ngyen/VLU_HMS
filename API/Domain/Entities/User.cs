namespace Domain.Entities;

public class User
{
    public int Id { get; set; }
    public required int RoleId { get; set; }
    public int? DepartmentId { get; set; }
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
}