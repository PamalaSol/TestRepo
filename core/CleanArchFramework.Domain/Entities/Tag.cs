using CleanArchFramework.Domain.Common;

namespace CleanArchFramework.Domain.Entities
{
    public sealed class Tag : BaseEntity<int>, IAuditableEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public ICollection<Post>? Posts { get; set; }
    }
}
