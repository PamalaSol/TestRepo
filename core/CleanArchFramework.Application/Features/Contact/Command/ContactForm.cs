using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Contact.Command
{
    public class ContactForm : IRequest<Result>
    {
        public required string Subject { get; set; }
        public required string Email { get; set; }
        public string? Company { get; set; }
        public string? Name { get; set; }
        public required string Message { get; set; }
    }


}
