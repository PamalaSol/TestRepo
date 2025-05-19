using MediatR;

namespace CleanArchFramework.Application.Features.Product.Commands.DeleteProduct
{
    public class DeleteProductCommand : IRequest<DeleteProductCommandResponse>
    {
        public Guid Id { get; set; }

    }
    
}
