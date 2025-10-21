namespace SchoolApp.Services
{
    public interface INotificationService
    {
        void SendEmail(string toEmail, string studentName);
        void SendSMS(string toPhone, string studentName);
    }
}
