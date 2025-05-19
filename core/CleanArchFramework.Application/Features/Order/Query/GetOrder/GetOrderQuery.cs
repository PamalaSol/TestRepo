using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Order.Query.GetOrder
{
    public class GetOrderQuery : IRequest<Result<GetOrderDto>>
    {
        public Guid Id { get; set; }
    }
}
