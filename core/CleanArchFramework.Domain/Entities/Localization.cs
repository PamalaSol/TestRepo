using CleanArchFramework.Domain.Common;

namespace CleanArchFramework.Domain.Entities
{
    public class Localization : BaseEntity<Guid>
    {
        public Guid LocalizationSetId { get; set; }
        public int LanguageId { get; set; }
        public string Value { get; set; }
        public virtual LocalizationSet LocalizationSet { get; set; }
        public virtual Language Language { get; set; }
    }
}
