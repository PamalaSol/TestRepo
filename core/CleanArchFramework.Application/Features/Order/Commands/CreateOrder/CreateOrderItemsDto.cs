namespace CleanArchFramework.Application.Features.Order.Commands.CreateOrder
{
    public class CreateOrderItemsDto
    {
        public Guid Id { get; set; }
        public string? Valve { get; set; }
        public string? Sleeve { get; set; }
        public string? SparePart { get; set; }
        public Guid? SleeveProductId { get; set; }
        public Guid? ValveProductId { get; set; }
        public Guid? AccessoriesProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string? ItemDescription { get; set; }


    }
}
