namespace Domain.Interfaces;

public interface IEmailService
{
    Task<bool> SendAsync(string subject, string content, string toEmail);
}