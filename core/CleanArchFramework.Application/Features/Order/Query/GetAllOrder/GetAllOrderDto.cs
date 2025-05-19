using CleanArchFramework.Application.Features.Order.Commands.CreateOrder;
using CleanArchFramework.Application.Features.Order.OrderStatus;

namespace CleanArchFramework.Application.Features.Order.Query.GetAllOrder
{
    public sealed class GetAllOrderDto
    {
        public Guid Id { get; set; }
        public string? Description { get; set; }
        public decimal OrderAmount { get; set; }
        public decimal Tax { get; set; }
        public decimal Discount { get; set; }
        public decimal FinalTotal { get; set; }
        public OrderStatusDto OrderStatus { get; set; }
        //  public User OrderedBy { get; set; }
        public string? OrderedById { get; set; }
        public List<CreateOrderItemsDto> OrderedItems { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
