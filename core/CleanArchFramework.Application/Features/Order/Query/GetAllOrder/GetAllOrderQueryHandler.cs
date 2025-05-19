using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Order.Query.GetAllOrder
{
    public sealed class GetAllOrderQueryHandler : IRequestHandler<GetAllOrderQuery, PagedResult<GetAllOrderDto>>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;

        public GetAllOrderQueryHandler(IMapper mapper, IOrderRepository orderRepository)
        {
            _mapper = mapper;
            _orderRepository = orderRepository;

        }

        public async Task<PagedResult<GetAllOrderDto>> Handle(GetAllOrderQuery getAllOrder, CancellationToken cancellationToken)
        {
            var allOrders = await _orderRepository.GetPagedOrderResponseAsync(
                            x => string.IsNullOrEmpty(getAllOrder.QueryOptions.SearchTerm)
                                                                          || x.Description.Contains(getAllOrder.QueryOptions.SearchTerm)
                                                                          || x.OrderedItems.Any(x => x.Sleeve != null && x.Sleeve.Contains(getAllOrder.QueryOptions.SearchTerm))
                                                                          || x.OrderedItems.Any(x => x.SparePart != null && x.SparePart.Contains(getAllOrder.QueryOptions.SearchTerm))
                                                                          || x.OrderedItems.Any(x => x.Valve != null && x.Valve.Contains(getAllOrder.QueryOptions.SearchTerm))
                ,
                getAllOrder.QueryOptions, x => x.Id,
                x => x.CreatedDate);

            var result = _mapper.Map<PagedResult<GetAllOrderDto>>(allOrders);
            result.Succeed();
            return result;
        }
    }
}
