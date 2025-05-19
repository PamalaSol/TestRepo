using CleanArchFramework.Application.Features.Product.Query.GetAllProduct;
using CleanArchFramework.Application.Features.Product.Query.GetProduct;
using CleanArchFramework.Application.Features.ProductCategory.Query.GetProductCategory;

namespace CleanArchFramework.Application.Features.Product.Commands.UpdateProduct
{
    public class UpdateProductDto
    {
        public Guid Id { get; set; }
        public required string Heading { get; set; }
        public string? Description { get; set; }
        public required string Content { get; set; }
        public bool IsFeatured { get; set; }
        public string? Material { get; set; }
        public string? SuitableFor { get; set; }
        public string? Quality { get; set; } //QUALITY FOR SLEEVES/ACCESSORIES
        public string? ConnectionType { get; set; }
        public string? Housing { get; set; }
        public string? NominalWidth { get; set; }
        public string? Size { get; set; } //DN
        public string? ConnectionMaterial { get; set; }
        public string? Screws { get; set; }
        public string? Industries { get; set; }

        public List<GetProductDto>? PinchValves { get; set; }
        public List<GetProductDto>? Sleeves { get; set; }

        public ICollection<ProductFileDto>? DataImages { get; set; }
        public ICollection<ProductFileDto>? DataFiles { get; set; }
        public ICollection<GetProductCategoryDto>? ProductCategories { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
