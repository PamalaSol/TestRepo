using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Posts.Query.GetAllPost
{
    public class GetAllPostQuery : IRequest<PagedResult<GetAllPostDto>>
    {
        public QueryOptions QueryOptions { get; set; } = new QueryOptions();
    }
}
