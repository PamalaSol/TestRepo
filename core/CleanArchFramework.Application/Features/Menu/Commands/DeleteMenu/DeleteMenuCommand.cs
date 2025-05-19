using MediatR;

namespace CleanArchFramework.Application.Features.Menu.Commands.DeleteMenu
{
    public class DeleteMenuCommand : IRequest<DeleteMenuCommandResponse>
    {
        public Guid Id { get; set; }

    }
    
}
