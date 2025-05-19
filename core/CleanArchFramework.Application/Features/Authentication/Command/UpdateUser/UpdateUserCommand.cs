using CleanArchFramework.Application.Models.Authentication.Public;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Authentication.Command.UpdateUser
{
    public class UpdateUserCommand : IRequest<Result<PublicUser>>
    {
        public string Id { get; set; }
        public Models.Authentication.UpdateUser User { get; set; }
    }
}
