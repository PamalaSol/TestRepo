using CleanArchFramework.Domain.Common;
using System.ComponentModel;

namespace CleanArchFramework.Domain.Entities
{
    public class FileCategory : BaseEntity<int>, IAuditableEntity
    {
        [Localizable(true)]
        public virtual LocalizationSet Name { get; set; }
        public required Guid NameId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet Description { get; set; }
        public bool IsActive { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        [Localizable(true)]
        public FileSet? Image { get; set; }
        public Guid? ImageId { get; set; }

    }
}
