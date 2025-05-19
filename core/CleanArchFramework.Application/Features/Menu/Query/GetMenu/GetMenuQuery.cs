using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Menu.Query.GetMenu
{
    public class GetMenuQuery : IRequest<Result<GetMenuDto>>
    {
        public Guid? Id { get; set; }
    }
}
