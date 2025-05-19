using CleanArchFramework.Domain.Common;
using System.ComponentModel;

namespace CleanArchFramework.Domain.Entities
{
    public class FileSet : BaseEntity<Guid>
    {
        [Localizable(true)]
        public virtual ICollection<FileStorage> Files { get; set; }

    }
}
