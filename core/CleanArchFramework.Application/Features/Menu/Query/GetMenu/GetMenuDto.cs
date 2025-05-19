namespace CleanArchFramework.Application.Features.Menu.Query.GetMenu
{
    public sealed class GetMenuDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public Guid? ParentId { get; set; }
        public GetMenuDto? Parent { get; set; }
        public string? Metadata { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
