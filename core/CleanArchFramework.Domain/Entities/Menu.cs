using CleanArchFramework.Domain.Common;

namespace CleanArchFramework.Domain.Entities
{
    public class Menu : BaseEntity<Guid>, IAuditableEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public Guid? ParentId { get; set; }
        public Menu? Parent { get; set; }
        public string? Metadata { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
