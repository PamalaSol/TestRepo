using CleanArchFramework.Domain.Common;
using System.ComponentModel;

namespace CleanArchFramework.Domain.Entities
{
    public class LocalizationSet : BaseEntity<Guid>
    {
        [Localizable(true)]
        public virtual ICollection<Localization> Localizations { get; set; }
    }
}
