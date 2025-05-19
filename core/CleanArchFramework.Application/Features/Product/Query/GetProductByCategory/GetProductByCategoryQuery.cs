using CleanArchFramework.Application.Features.Product.Query.GetProduct;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Product.Query.GetProductByCategory
{
    public class GetProductByCategoryQuery : IRequest<Result<GetProductDto>>
    {

        /// <summary>
        /// Product id 
        /// </summary>
        public Guid Id { get; set; }
        public int? CategoryId { get; set; }
   }
}
