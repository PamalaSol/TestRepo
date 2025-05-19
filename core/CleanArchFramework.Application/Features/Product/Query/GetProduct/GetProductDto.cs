using CleanArchFramework.Application.Features.Product.Commands.CreateProduct;
using CleanArchFramework.Application.Features.Product.Query.GetAllProduct;
using CleanArchFramework.Application.Features.ProductCategory.Query.GetProductCategory;

namespace CleanArchFramework.Application.Features.Product.Query.GetProduct
{
    public sealed class GetProductDto
    {
        public Guid Id { get; set; }
        public required string Heading { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }

        //Details
        public string? Series { get; set; }
        public string? Dimensions { get; set; }
        public ICollection<GetProductCategoryDto>? ProductCategories { get; set; }
        public string? Quality { get; set; } //QUALITY FOR SLEEVES/ACCESSORIES
        public string? ConnectionType { get; set; }
        public List<PinchValvesSleevesDto> PinchValvesSleeves { get; set; }
        public List<PinchValvesSleevesDto> SleevesPinchValves { get; set; }
        public string? Housing { get; set; }
        public string? NominalWidth { get; set; }
        public string? Size { get; set; } //DN
        public string? Material { get; set; }
        public string? SuitableFor { get; set; }
        public string? ConnectionMaterial { get; set; }
        public string? Screws { get; set; }
        public string? Industries { get; set; }
        //       public  ICollection<GetProductDto>? PinchValves { get; set; }c
        //     public  ICollection<GetProductDto>? Sleeves { get; set; }
        public ICollection<ProductFileDto>? DataImages { get; set; }
        //[Localizable(true)]
        public ICollection<ProductFileDto>? DataFiles { get; set; }
        //public string? CreatedBy { get; set; }
        //public DateTime CreatedDate { get; set; }
        //public string? ModifiedBy { get; set; }
        //public DateTime? ModifiedOn { get; set; }


    }
}
