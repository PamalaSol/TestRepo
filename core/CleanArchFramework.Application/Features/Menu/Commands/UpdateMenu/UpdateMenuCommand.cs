using MediatR;

namespace CleanArchFramework.Application.Features.Menu.Commands.UpdateMenu
{
    public class UpdateMenuCommand : IRequest<UpdateMenuCommandResponse>
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? ParentId { get; set; }
        public string? Metadata { get; set; }
    }
    
}
