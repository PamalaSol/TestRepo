using MediatR;

namespace CleanArchFramework.Application.Features.Menu.Commands.CreateMenu
{
    public class CreateMenuCommand : IRequest<CreateMenuCommandResponse>
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? ParentId { get; set; }
        public string? Metadata { get; set; }
    }
    
}
