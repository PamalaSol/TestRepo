using MediatR;

namespace CleanArchFramework.Application.Features.Category.Command.DeleteCategory
{
    public class DeleteCategoryCommand : IRequest<DeleteCategoryCommandResponse>
    {
        public int Id { get; set; }

    }
    
}
