using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.ProductCategory.Query.GetAllProductCategory
{
    public class GetAllProductCategoryQuery : IRequest<PagedResult<GetAllProductCategoryDto>>
    {
        public QueryOptions QueryOptions { get; set; } = new QueryOptions();
    }
}
