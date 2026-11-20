using System.Net.Mail;
using ImmoSphere.Domain.Services.Interfaces;
using Microsoft.Extensions.Configuration;

namespace ImmoSphere.Infrastructure.Services.Email;

public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public SmtpEmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(
        string to,
        string subject,
        string body)
    {
        var host = _configuration["Smtp:Host"]
                   ?? throw new InvalidOperationException(
                       "Hôte SMTP non configuré");

        var port = _configuration.GetValue<int>("Smtp:Port");
        var enableSsl = _configuration.GetValue<bool>("Smtp:EnableSsl");

        using var smtpClient = new SmtpClient(host, port)
        {
            EnableSsl = enableSsl,
            UseDefaultCredentials = false,
            DeliveryMethod = SmtpDeliveryMethod.Network
        };

        using var message = new MailMessage
        {
            From = new MailAddress("noreply@immosphere.local"),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };

        message.To.Add(to);

        await smtpClient.SendMailAsync(message);
    }
}