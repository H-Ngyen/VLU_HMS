namespace Application.Users.Dtos;

public class UserDto
{
    public int Id { get; set; }
    // public required int RoleId { get; set; }
    public required string Auth0Id { get; set; }
    public required string Email { get; set; }
    public required string Name { get; set; }
    public bool Active { get; set; }
    public required string RoleName { get; set; }
    public required DateTime CreateAt { get; set; }
}