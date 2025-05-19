using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Tag.Query.GetAllTag
{
    public class GetAllTagQuery : IRequest<PagedResult<GetAllTagDto>>
    {
        public QueryOptions QueryOptions { get; set; } = new QueryOptions();
    }
}
