using MediatR;

namespace CleanArchFramework.Application.Features.ProductCategory.Command.DeleteProductCategory
{
    public class DeleteProductCategoryCommand : IRequest<DeleteProductCategoryCommandResponse>
    {
        public int Id { get; set; }

    }
    
}
