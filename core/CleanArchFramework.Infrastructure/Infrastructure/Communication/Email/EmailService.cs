using CleanArchFramework.Application.Contracts.Infrastructure.Communication;
using CleanArchFramework.Application.Shared.Options.ConfigOptions;
using CleanArchFramework.Application.Shared.Result;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;

namespace CleanArchFramework.Infrastructure.Infrastructure.Communication.Email
{
    internal class EmailService : IEmailService
    {
        private readonly EmailOptions _options;
        public EmailService(IOptions<EmailOptions> options)
        {
            _options = options.Value;
        }
        public void Send(string to, string subject, string html, string? from = null)
        {
            // create message
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(from ?? _options.SenderEmail));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = html };

            // send email
            using var smtp = new MailKit.Net.Smtp.SmtpClient();
            smtp.Connect(_options.Host, _options.Port, SecureSocketOptions.Auto);
            smtp.Authenticate(_options.Username, _options.Password);
            smtp.Send(email);
            smtp.Disconnect(true);
        }

        public async Task<Result> SendEmailAsync(string to, string subject, string message, string? from = null)
        {
            // create message
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(from ?? _options.SenderEmail));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = message };

            // send email
            return await SendEmail(email);
        }
        public async Task<Result> SendEmailAsync(List<string> tos, string subject, string message, string? from = null)
        {
            // create message
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(from ?? _options.SenderEmail));
            List<MailboxAddress> listMailboxAddress = new List<MailboxAddress>();
            foreach (string to in tos)
            {
                listMailboxAddress.Add(MailboxAddress.Parse(to));
            }
            email.Bcc.AddRange(listMailboxAddress);
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = message };

            // send email
            return await SendEmail(email);
        }
        private async Task<Result> SendEmail(MimeMessage email)
        {
            var result = new Result();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_options.Host, _options.Port, SecureSocketOptions.StartTls);
            if (_options.UseAuthentication)
            {
                await smtp.AuthenticateAsync(_options.Username, _options.Password);
            }
            var resultMessage = await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
            return !string.IsNullOrEmpty(resultMessage) ? result.Succeed() : result.Fail().WithMessage(resultMessage);
        }
    }
}
