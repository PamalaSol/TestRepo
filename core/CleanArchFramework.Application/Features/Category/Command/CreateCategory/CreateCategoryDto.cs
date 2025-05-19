using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Application.Features.Category.Command.CreateCategory
{
    public sealed class CreateCategoryDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public Guid? ImageId { get; set; }
        public string? DataImage { get; set; }
        public string? Alt { get; set; }
        public string? CreatedBy { get; set; }
        public int? ParentCategoryId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public Domain.Entities.Category? ParentCategory { get; set; }
        public ICollection<Post>? Posts { get; set; }
    }
}
