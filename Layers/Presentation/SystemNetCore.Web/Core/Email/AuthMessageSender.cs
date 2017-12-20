namespace SystemNetCore.Web.Core.Email
{
    using System.Net;
    using System.Net.Mail;
    using System.Threading.Tasks;

    public class AuthMessageSender : IEmailSender
    {
        private readonly string _fromAddress;
        private readonly string _password;
        private readonly string _emailServer;

        public AuthMessageSender(string fromAddress, string password, string emailServer)
        {
            _fromAddress = fromAddress;
            _password = password;
            _emailServer = emailServer;
        }

        public Task SendEmailAsync(string email, string subject, string message)
        {
            MailMessage mail = new MailMessage
            {
                From = new MailAddress(_fromAddress),
                Subject = subject,
                IsBodyHtml = true,
                Body = message
            };

            mail.To.Add(email);

            SmtpClient smtp = new SmtpClient(_emailServer);

            NetworkCredential credentials = new NetworkCredential(_fromAddress, _password);

            smtp.Credentials = credentials;
            return smtp.SendMailAsync(mail);

        }
    }
}
