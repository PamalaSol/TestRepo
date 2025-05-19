namespace CleanArchFramework.Application.Features.Menu.Commands.UpdateMenu
{
    public class UpdateMenuDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? ParentId { get; set; }
        public string? Metadata { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
