namespace CleanArchFramework.Application.Features.ProductCategory.Command.CreateProductCategory
{
    public sealed class CreateProductCategoryDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public Guid? ImageId { get; set; }
        public string? DataImage { get; set; }
        public string? Alt { get; set; }
        public string? CreatedBy { get; set; }
        public int? ParentProductCategoryId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public Domain.Entities.ProductCategory? ParentProductCategory { get; set; }
    }
}
