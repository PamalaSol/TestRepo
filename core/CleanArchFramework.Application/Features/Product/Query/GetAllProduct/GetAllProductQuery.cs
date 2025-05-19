using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Product.Query.GetAllProduct
{
    public class GetAllProductQuery : IRequest<PagedResult<GetAllProductDto>>
    {
        public QueryOptions QueryOptions { get; set; } = new QueryOptions();
        public string? Size { get; set; }
        public string? Connection { get; set; }
        public string? HousingMaterial { get; set; }
        public string? SleeveQuality { get; set; }
    }
}
