using CleanArchFramework.Domain.Common;
using System.ComponentModel;

namespace CleanArchFramework.Domain.Entities
{
    public class Product : BaseEntity<Guid>, IAuditableEntity
    {

        [Localizable(true)]
        public virtual LocalizationSet Heading { get; set; }
        public Guid HeadingId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet Description { get; set; }
        public Guid? DescriptionId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet Content { get; set; }
        public Guid? ContentId { get; set; }
        //Details
        public string? Series { get; set; } //SERIES FOR PINCH VALVES
        public string? Quality { get; set; } //QUALITY FOR SLEEVES/ACCESSORIES
        public string? Dimensions { get; set; }
        [Localizable(true)]
        public LocalizationSet? ConnectionType { get; set; }
        public Guid? ConnectionTypeId { get; set; }
        public Guid? HousingId { get; set; }
        [Localizable(true)]
        public LocalizationSet? Housing { get; set; }
        public string? NominalWidth { get; set; }
        public string? Size { get; set; } //DN
        public Guid? MaterialId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet? Material { get; set; }
        public Guid? SuitableForId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet? SuitableFor { get; set; }

        public Guid? ConnectionMaterialId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet? ConnectionMaterial { get; set; }

        public Guid? ScrewsId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet? Screws { get; set; }

        public Guid? IndustriesId { get; set; }
        [Localizable(true)]
        public virtual LocalizationSet? Industries { get; set; }
        public virtual ICollection<PinchValveSleeve>? PinchValves { get; set; }
        public virtual ICollection<PinchValveSleeve>? Sleeves { get; set; }
        public virtual ICollection<ProductCategory>? ProductCategories { get; set; }
        [Localizable(true)]
        public FileSet? Images { get; set; }
        public Guid? ImagesId { get; set; }
        [Localizable(true)]
        public FileSet? Files { get; set; }
        public Guid? FilesId { get; set; }
        public decimal? Price { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }


}
