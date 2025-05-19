using MediatR;

namespace CleanArchFramework.Application.Features.Order.Commands.DeleteOrder
{
    public class DeleteOrderCommand : IRequest<DeleteOrderCommandResponse>
    {
        public Guid Id { get; set; }

    }
    
}
