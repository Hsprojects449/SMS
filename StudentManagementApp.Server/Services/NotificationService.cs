using MailKit.Net.Smtp;
using MimeKit;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using SchoolApp.Services;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Text;

namespace SchoolApp.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public NotificationService(IConfiguration config)
        {
            _config = config;
            _httpClient = new HttpClient();
        }

        public void SendEmail(string toEmail, string studentName)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_config["EmailSettings:FromEmail"]));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = $"Absence Alert for {studentName}";
            email.Body = new TextPart("plain")
            {
                Text = $"Dear Parent,\n\nYour child {studentName} was marked absent today.\n\n- School Admin"
            };
            using var smtp = new SmtpClient();
            smtp.Connect(_config["EmailSettings:SmtpHost"], int.Parse(_config["EmailSettings:SmtpPort"]), true);
            smtp.Authenticate(_config["EmailSettings:SmtpUser"], _config["EmailSettings:SmtpPass"]);
            smtp.Send(email);
            smtp.Disconnect(true);
        }

        public void SendSMS(string toPhone, string studentName)
        {
            var payload = new
            {
                sender = _config["MSG91:Sender"],
                route = _config["MSG91:Route"],
                country = _config["MSG91:Country"],
                sms = new[]
                {
                    new {
                        message = $"Your child {studentName} was marked absent today.",
                        to = new[] { toPhone }
                    }
                }
            };

            var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("authkey", _config["MSG91:AuthKey"]);

            var response = _httpClient.PostAsync("https://control.msg91.com/api/v2/sendsms", content).Result;
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine("MSG91 SMS failed: " + response.StatusCode);
            }
        }
    }
}
