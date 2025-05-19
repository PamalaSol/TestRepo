using CleanArchFramework.Application.Models.Authentication.Public;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Authentication.Command.UpdateBaseUser
{
    public class UpdateBaseUserCommand : IRequest<Result<PublicUser>>
    {
        public string Id { get; set; }
        public Models.Authentication.Public.UpdateUserBase User { get; set; }
    }
}
