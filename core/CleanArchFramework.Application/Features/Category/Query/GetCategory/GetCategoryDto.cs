namespace CleanArchFramework.Application.Features.Category.Query.GetCategory
{
    public sealed class GetCategoryDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public Guid? ImageId { get; set; }
        public string? DataImage { get; set; }
        public string? Alt { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int? ParentCategoryId { get; set; }
        public GetCategoryDto? ParentCategory { get; set; }

    }
}
