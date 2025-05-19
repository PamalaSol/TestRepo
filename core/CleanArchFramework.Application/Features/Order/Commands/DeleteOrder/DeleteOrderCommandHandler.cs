using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Order.Commands.DeleteOrder
{
    public class DeleteOrderCommandHandler : IRequestHandler<DeleteOrderCommand, DeleteOrderCommandResponse>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public DeleteOrderCommandHandler(IMapper mapper, IOrderRepository orderRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _orderRepository = orderRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeleteOrderCommandResponse> Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
        {
            var deleteOrderCommandResponse = new DeleteOrderCommandResponse();

            var validator = new DeleteOrderCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                deleteOrderCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    deleteOrderCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                deleteOrderCommandResponse.Succeed();
                var order = await _orderRepository.GetOrderAsync(request.Id);
                order = await _orderRepository.DeleteAsync(order);
                await _unitOfWork.SaveAsync(cancellationToken);
                deleteOrderCommandResponse.Data = _mapper.Map<DeleteOrderDto>(order);
                return deleteOrderCommandResponse;
            }

            return deleteOrderCommandResponse;
        }
    }
}
