using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Menu.Query.GetAllMenus
{
    public class GetAllMenuQuery : IRequest<PagedResult<GetAllMenuDto>>
    {
        public QueryOptions QueryOptions { get; set; } = new QueryOptions();
    }
}
