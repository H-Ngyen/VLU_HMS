namespace Domain.Entities;
public class User
{
    public int Id { get; set; }
    public required int RoleId { get; set; }
    public required string Auth0Id { get; set; }
    public required string Email { get; set; }
    public required DateTime CreateAt { get; set; }

    // Navigation Properties
    public Role Role { get; set; } = null!;
}