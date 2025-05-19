using System.ComponentModel;
using CleanArchFramework.Domain.Common;

namespace CleanArchFramework.Domain.Entities
{
    public  class About : BaseEntity<int>, IAuditableEntity
    {
        public Guid? ImageId { get; set; }
        [Localizable(true)]
        public FileSet? Image { get; set; }
        //public Guid? BackgroundImageId { get; set; }
        //public FileStorage? BackgroundImage { get; set; }
        public Guid? TitleId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet? Title { get; set; }
        public Guid? SubtitleId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet? Subtitle { get; set; }
        public Guid? InfoTextId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet? InfoText { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
