using Microsoft.Extensions.Options;
using MimeKit;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> opts)
        => _settings = opts.Value;

    public async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        var msg = new MimeMessage();
        msg.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
        msg.To.Add(MailboxAddress.Parse(to));
        msg.Subject = subject;
        msg.Body = new TextPart("html") { Text = htmlBody };

        using var client = new MailKit.Net.Smtp.SmtpClient();
        await client.ConnectAsync(_settings.SmtpHost, _settings.SmtpPort, false);
        await client.AuthenticateAsync(_settings.SmtpUser, _settings.SmtpPass);
        await client.SendAsync(msg);
        await client.DisconnectAsync(true);
    }
}

public class EmailSettings
{
    public string SmtpHost { get; set; } = "";
    public int SmtpPort { get; set; }
    public string SmtpUser { get; set; } = "";
    public string SmtpPass { get; set; } = "";
    public string FromEmail { get; set; } = "";
    public string FromName { get; set; } = "";
}
