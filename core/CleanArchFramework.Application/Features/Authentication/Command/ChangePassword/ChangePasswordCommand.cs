using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Authentication.Command.ChangePassword
{
    public class ChangePasswordCommand : IRequest<Result>
    {
        public required string UserId { get; set; }
        public required string OldPassword { get; set; }
        public required string Password { get; set; }
        public required string ConfirmPassword { get; set; }
    }
}
