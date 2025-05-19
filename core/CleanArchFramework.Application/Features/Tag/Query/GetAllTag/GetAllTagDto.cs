namespace CleanArchFramework.Application.Features.Tag.Query.GetAllTag
{
    public sealed class GetAllTagDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

    
    }
}
