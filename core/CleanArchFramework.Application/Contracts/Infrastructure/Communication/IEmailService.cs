using CleanArchFramework.Application.Shared.Result;

namespace CleanArchFramework.Application.Contracts.Infrastructure.Communication
{
    public interface IEmailService
    {
        void Send(string to, string subject, string html, string? from = null);
        Task<Result> SendEmailAsync(List<string> tos, string subject, string message, string? from = null);
        Task<Result> SendEmailAsync(string to, string subject, string message, string? from = null);
    }
}
