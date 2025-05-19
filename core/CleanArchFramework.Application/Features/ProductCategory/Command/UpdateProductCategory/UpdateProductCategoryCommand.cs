using MediatR;
using Microsoft.AspNetCore.Http;

namespace CleanArchFramework.Application.Features.ProductCategory.Command.UpdateProductCategory
{
    public class UpdateProductCategoryCommand : IRequest<UpdateProductCategoryCommandResponse>
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public IFormFile? Image { get; set; }
        public string? Alt { get; set; }
        public int? ParentProductCategoryId { get; set; }
    }
    
}
