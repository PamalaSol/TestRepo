using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Product.Query.GetProductsByCategory
{
    public class GetProductsByCategoryQuery : IRequest<PagedResult<GetProductsByCategoryDto>>
    {
        public int? ProductCategory { get; set; }
        public QueryOptions QueryOptions { get; set; } = new QueryOptions();

        public string? Size { get; set; }
        public string? Connection { get; set; }
        public string? HousingMaterial { get; set; }
        public string? SleeveQuality { get; set; }
    }
}
