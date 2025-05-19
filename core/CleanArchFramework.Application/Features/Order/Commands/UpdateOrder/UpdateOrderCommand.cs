using MediatR;

namespace CleanArchFramework.Application.Features.Order.Commands.UpdateOrder
{
    public class UpdateOrderCommand : IRequest<UpdateOrderCommandResponse>
    {
        public Guid Id { get; set; }
        public string? Description { get; set; }
        //  public List<CreateOrderItemsDto> OrderedItems { get; set; }
        public int OrderStatusId { get; set; }

    }

}
