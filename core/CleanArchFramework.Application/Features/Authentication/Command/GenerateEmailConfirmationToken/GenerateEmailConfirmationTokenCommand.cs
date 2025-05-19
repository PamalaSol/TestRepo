using CleanArchFramework.Application.Models.Authentication.Public;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Authentication.Command.GenerateEmailConfirmationToken
{
    public class GenerateEmailConfirmationTokenCommand : IRequest<Result<PublicUser>>
    {
        public required string Email { get; set; }
    }
}
