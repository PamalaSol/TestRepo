namespace CleanArchFramework.Application.Features.Category.Command.UpdateCategory
{
    public class UpdateCategoryDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public Guid? ImageId { get; set; }
        public string? DataImage { get; set; }
        public string? Alt { get; set; }
        public string? ParentId { get; set; }
        public string? Metadata { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
