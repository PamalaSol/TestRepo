using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Order.Commands.UpdateOrder
{
    public class UpdateOrderCommandHandler : IRequestHandler<UpdateOrderCommand, UpdateOrderCommandResponse>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
    
        public UpdateOrderCommandHandler(IMapper mapper, IOrderRepository orderRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _orderRepository = orderRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<UpdateOrderCommandResponse> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
        {
            var updateOrderCommandResponse = new UpdateOrderCommandResponse();

            var validator = new UpdateOrderCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                updateOrderCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    updateOrderCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {

                var orderToUpdate = await _orderRepository.GetFirstAsync(x => x.Id == request.Id);
                updateOrderCommandResponse.Succeed();
                var mapped = _mapper.Map(request, orderToUpdate);
                var order = await _orderRepository.UpdateAsync(mapped);
                await _unitOfWork.SaveAsync(cancellationToken);
                updateOrderCommandResponse.Data = _mapper.Map<UpdateOrderDto>(order);
            }

            return updateOrderCommandResponse;
        }
    }
}
