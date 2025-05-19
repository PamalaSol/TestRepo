using MediatR;

namespace CleanArchFramework.Application.Features.Posts.Commands.DeletePost
{
    public class DeletePostCommand : IRequest<DeletePostCommandResponse>
    {
        public Guid Id { get; set; }

    }
    
}
