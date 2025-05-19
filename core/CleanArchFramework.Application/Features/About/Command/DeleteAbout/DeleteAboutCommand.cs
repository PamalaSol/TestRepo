using MediatR;

namespace CleanArchFramework.Application.Features.About.Command.DeleteAbout
{
    public class DeleteAboutCommand : IRequest<DeleteAboutCommandResponse>
    {
        public int Id { get; set; }

    }
    
}
