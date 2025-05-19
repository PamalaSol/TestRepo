using MediatR;

namespace CleanArchFramework.Application.Features.Tag.Commands.DeleteTag
{
    public class DeleteTagCommand : IRequest<DeleteTagCommandResponse>
    {
        public int Id { get; set; }

    }
    
}
