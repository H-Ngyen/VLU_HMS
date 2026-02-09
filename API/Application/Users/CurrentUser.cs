namespace Application.Users;

public record CurrentUser(string Id,
    string Email,
    string Name,
    string Role)
{
    public bool IsInRole(string role) => Role.Contains(role);
}