using System.Net;
using System.Net.Mail;
using Domain.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services;

internal class EmailService(IConfiguration config) : IEmailService
{
    private readonly string _fromEmail = config["Email:FromEmail"] ?? throw new InvalidOperationException("Email:FromEmail is not configured");
    private readonly string _fromEmailPassword = config["Email:Password"] ?? throw new InvalidOperationException("Email:Password is not configured");
    private readonly string _smtpHost = config["Email:SmtpHost"] ?? throw new InvalidOperationException("Email:SmtpHost is not configured");
    private readonly int _smtpPort = config.GetValue<int?>("Email:SmtpPort") ?? throw new InvalidOperationException("Email:SmtpPort is not configured or invalid");
    public async Task<bool> SendAsync(string subject, string content, string toEmail)
    {
        try
        {
            using var smtp = new SmtpClient(_smtpHost, _smtpPort)
            {
                Credentials = new NetworkCredential(_fromEmail, _fromEmailPassword),
                EnableSsl = true
            };

            var mail = new MailMessage
            {
                From = new MailAddress(_fromEmail),
                Subject = subject,
                Body = content,
                IsBodyHtml = true
            };

            mail.To.Add(toEmail);

            await smtp.SendMailAsync(mail);
            return true;
        }
        catch
        {
            return false;
        }

    }
}