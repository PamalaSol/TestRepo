using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.ProductCategory.Query.GetProductCategory
{
    public class GetProductCategoryQuery : IRequest<Result<GetProductCategoryDto>>
    {
        public int Id { get; set; }
    }
}
