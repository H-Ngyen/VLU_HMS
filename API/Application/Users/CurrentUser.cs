namespace Application.Users;

public record CurrentUser(int Id,
    string Auth0Id,
    string Email,
    bool EmailVerified,
    string Name,
    string Role)
{
    public bool IsInRole(string role) => Role.Contains(role);
}