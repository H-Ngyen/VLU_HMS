namespace Domain.Constants;

public record CurrentUser(int Id,
    string Auth0Id,
    string Email,
    bool EmailVerified,
    string Name,
    string Role,
    int? DepartmentId)
{
    public bool IsInRole(string role) => Role.Contains(role);
}