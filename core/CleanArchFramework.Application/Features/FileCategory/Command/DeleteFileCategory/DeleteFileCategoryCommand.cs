using MediatR;

namespace CleanArchFramework.Application.Features.FileCategory.Command.DeleteFileCategory
{
    public class DeleteFileCategoryCommand : IRequest<DeleteFileCategoryCommandResponse>
    {
        public int Id { get; set; }

    }
    
}
