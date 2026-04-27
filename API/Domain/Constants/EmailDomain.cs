using System.Net.Mail;

namespace Domain.Constants;

public static class EmailDomain
{
    public const string Admin = "zer0project.onmicrosoft.com";
    public const string Teacher = "vlu.edu.vn";
    public const string Student = "vanlanguni.vn";
    public static IReadOnlyCollection<string> All = [Admin, Teacher, Student];
    public static bool IsInDomain(string email)
    {
        var domain = GetDomainEmail(email);
        if (domain == null)
            return false;
        return All.Contains(domain);
    }
    public static string? GetDomainEmail(string email)
    {
        if (!IsEmail(email))
            return null;
        return email.Split('@').Last().ToLower();
    }

    public static bool IsEmail(string email)
    {
        var trimmedEmail = email.Trim();

        if (trimmedEmail.EndsWith('.'))
        {
            return false; // suggested by @TK-421
        }
        try
        {
            var addr = new MailAddress(email);
            return addr.Address == trimmedEmail;
        }
        catch
        {
            return false;
        }
    }
}