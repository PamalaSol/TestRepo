using CleanArchFramework.Domain.Common;
using System.ComponentModel;

namespace CleanArchFramework.Domain.Entities
{
    public class Faq : BaseEntity<int>, IAuditableEntity
    {
        public required Guid QuestionId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet? Question { get; set; }
        public required Guid AnswerId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet? Answer { get; set; }
        public bool IsPublished { get; set; }
        public bool IsPromoted { get; set; }
        public string? LinkTo { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
