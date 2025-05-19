using MediatR;
using Microsoft.AspNetCore.Http;

namespace CleanArchFramework.Application.Features.ProductCategory.Command.CreateProductCategory
{
    public class CreateProductCategoryCommand : IRequest<CreateProductCategoryCommandResponse>
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public IFormFile? ImageUrl { get; set; }
        public string? Alt { get; set; }
        public int? ParentProductCategoryId { get; set; }

    }
}
