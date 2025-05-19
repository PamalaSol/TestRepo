using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Product.Query.GetProduct
{
    public class GetProductQuery : IRequest<Result<GetProductDto>>
    {
        public Guid Id { get; set; }
    }
}
