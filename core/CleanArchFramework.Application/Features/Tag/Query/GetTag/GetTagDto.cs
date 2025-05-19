using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Application.Features.Tag.Query.GetTag
{
    public sealed class GetTagDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

    //    public ICollection<Post>? Posts { get; set; }
    }
}
