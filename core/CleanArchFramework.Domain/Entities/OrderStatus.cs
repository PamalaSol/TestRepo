using System.ComponentModel;
using CleanArchFramework.Domain.Common;

namespace CleanArchFramework.Domain.Entities
{
    public class OrderStatus : BaseEntity<int>
    {
        public required Guid NameId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet? Name { get; set; }

        public required Guid DescriptionId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet? Description { get; set; }
    }
}
