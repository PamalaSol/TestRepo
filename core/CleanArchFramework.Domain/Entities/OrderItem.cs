using CleanArchFramework.Domain.Common;

namespace CleanArchFramework.Domain.Entities
{
    public class OrderItem : BaseEntity<Guid>
    {
        public string? Valve { get; set; }
        public string? Sleeve { get; set; }
        public string? SparePart { get; set; }
        public Guid? SleeveProductId { get; set; }
        public Product? SleeveProduct { get; set; }
        public Guid? ValveProductId { get; set; }
        public Product? ValveProduct { get; set; }
        public Guid? AccessoriesProductId { get; set; }
        public Product? AccessoriesProduct { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Tax { get; set; }
        public decimal Discount { get; set; }
        public decimal FinalTotal { get; set; }
        public string? ItemDescription { get; set; }

    }
}
