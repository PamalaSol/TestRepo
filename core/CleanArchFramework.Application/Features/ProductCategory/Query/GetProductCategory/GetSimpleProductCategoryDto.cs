namespace CleanArchFramework.Application.Features.ProductCategory.Query.GetProductCategory
{
    public class GetSimpleProductCategoryDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public Guid? ImageId { get; set; }
        public string? DataImage { get; set; }
        public string? Alt { get; set; }
    }
}
