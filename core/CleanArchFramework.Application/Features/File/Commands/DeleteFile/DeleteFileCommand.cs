using MediatR;

namespace CleanArchFramework.Application.Features.File.Commands.DeleteFile
{
    public class DeleteFileCommand : IRequest<DeleteFileCommandResponse>
    {
        public Guid Id { get; set; }

    }
    
}
