using CleanArchFramework.Domain.Common;

namespace CleanArchFramework.Domain.Entities
{
    public class Order : BaseEntity<Guid>, IAuditableEntity
    {
        public bool IsOrder { get; set; } // true for order, false for quotation
        public string? CustomerId { get; set; }
        public string? Company { get; set; }
        public string? Name { get; set; }
        public string? Street { get; set; }
        public string? Zip { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Description { get; set; }

        public bool IsDifferentAddress { get; set; } // true for different address, false for same address
        public bool PackagingCostNeeded { get; set; } // true for packaging cost needed, false for not needed
        public bool ShippingCostNeeded { get; set; } // true for shipping cost needed, false for not needed

        public string? ShippingId { get; set; }
        public string? ShippingName { get; set; }
        public string? ShippingCompany { get; set; }
        public string? ShippingCountry { get; set; }
        public string? ShippingEmail { get; set; }
        public string? ShippingStreet { get; set; }
        public string? ShippingZip { get; set; }
        public decimal OrderAmount { get; set; }
        public decimal Tax { get; set; }
        public decimal Discount { get; set; }
        public decimal FinalTotal {get; set; }
        public ApplicationUser? OrderedBy { get; set; }
        public string? OrderedById { get; set; }
        public List<OrderItem> OrderedItems { get; set; }
        public int OrderStatusId { get; set; } = 1;
        public OrderStatus OrderStatus { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
