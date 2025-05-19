using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Order.Query.GetAllOrder
{
    public class GetAllOrderQuery : IRequest<PagedResult<GetAllOrderDto>>
    {
        public QueryOptions QueryOptions { get; set; } = new QueryOptions();
        public bool IsPublished { get; set; } = true;
    }
}
