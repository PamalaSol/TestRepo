using CleanArchFramework.Domain.Common;

namespace CleanArchFramework.Domain.Entities
{
    public class Language : BaseEntity<int>
    {

        public string Name { get; set; }
        public string Culture { get; set; }
        public virtual ICollection<Localization> Localizations { get; set; }
        public virtual ICollection<FileSet> FileSets { get; set; }
    }
}
