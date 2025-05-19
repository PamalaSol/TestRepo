using CleanArchFramework.Domain.Common;
using System.ComponentModel;

namespace CleanArchFramework.Domain.Entities
{
    public class Category : BaseEntity<int>, IAuditableEntity
    {
        [Localizable(true)]
        public virtual LocalizationSet Name { get; set; }
        public required Guid NameId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet Description { get; set; }
        public Guid? DescriptionId { get; set; }
        public Guid? ImageId { get; set; }
        [Localizable(true)]
        public FileSet? Image { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int? ParentCategoryId { get; set; }
        public Category? ParentCategory { get; set; }
        public ICollection<Post>? Posts { get; set; }
    }
}
