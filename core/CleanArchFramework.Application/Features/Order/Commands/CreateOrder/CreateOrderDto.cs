using CleanArchFramework.Application.Features.Order.OrderStatus;

namespace CleanArchFramework.Application.Features.Order.Commands.CreateOrder
{
    public sealed class CreateOrderDto
    {
        public Guid Id { get; set; }
        public string? CustomerId { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? ShippingId { get; set; }
        public string? ShippingName { get; set; }
        public string? ShippingEmail { get; set; }
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
