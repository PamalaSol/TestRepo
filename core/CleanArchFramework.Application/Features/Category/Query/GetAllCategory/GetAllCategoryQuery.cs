using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Category.Query.GetAllCategory
{
    public class GetAllCategoryQuery : IRequest<PagedResult<GetAllCategoryDto>>
    {
        public QueryOptions QueryOptions { get; set; } = new QueryOptions();
    }
}
