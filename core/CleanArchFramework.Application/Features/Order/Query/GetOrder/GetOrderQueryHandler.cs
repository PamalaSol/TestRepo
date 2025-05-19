using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Order.Query.GetOrder
{
    public sealed class GetOrderQueryHandler : IRequestHandler<GetOrderQuery, Result<GetOrderDto>>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;

        public GetOrderQueryHandler(IMapper mapper, IOrderRepository orderRepository)
        {
            _mapper = mapper;
            _orderRepository = orderRepository;
        }

        public async Task<Result<GetOrderDto>> Handle(GetOrderQuery request, CancellationToken cancellationToken)
        {
            var allOrder = await _orderRepository.GetOrderAsync(request.Id);
            var result = new Result<GetOrderDto>();
            result.Data = _mapper.Map<GetOrderDto>(allOrder);
            result.Succeed();
            return result;
        }
    }
}
