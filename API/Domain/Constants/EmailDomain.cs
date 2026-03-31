namespace Domain.Constants;

public static class EmailDomain
{
    public const string Admin = "zer0project.onmicrosoft.com";
    public const string Teacher = "vlu.edu.vn";
    public const string Student = "vanlanguni.vn";
    public static IReadOnlyCollection<string> All = [Admin, Teacher, Student];
    public static bool IsInDomain(string Email)
    {
        var domain = GetDomainEmail(Email);
        return All.Contains(domain);
    }
    public static string GetDomainEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
            return string.Empty;
        return email.Split('@').Last().ToLower();
    }
}