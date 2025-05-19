using CleanArchFramework.Application.Features.Category.Query.GetCategory;
using CleanArchFramework.Application.Features.Tag.Query.GetTag;

namespace CleanArchFramework.Application.Features.Posts.Commands.UpdatePost
{
    public class UpdatePostDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Keywords { get; set; }
        public required string Content { get; set; }
        public bool IsFeatured { get; set; }
        public Guid? ImageId { get; set; }
        public string? DataImage { get; set; }
        public string? Alt { get; set; }
        public ICollection<GetCategoryDto>? Categories { get; set; }
        public ICollection<GetTagDto>? Tags { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
