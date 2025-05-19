using System.ComponentModel;
using CleanArchFramework.Domain.Common;

namespace CleanArchFramework.Domain.Entities
{
    public class Post : BaseEntity<Guid>, IAuditableEntity
    {
        public required Guid NameId { get; set; }
        public Guid? DescriptionId { get; set; }
        public string? Keywords { get; set; }
        public required Guid ContentId { get; set; }
        public Guid? ImageId { get; set; }
        [Localizable(true)]
        public FileSet? Image { get; set; }
        public bool IsFeatured { get; set; }
        [Localizable(true)]
        public ICollection<Category>? Categories { get; set; }
        [Localizable(true)]
        public ICollection<Tag>? Tags { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet Name { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet Description { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet Content { get; set; }
    }
}
