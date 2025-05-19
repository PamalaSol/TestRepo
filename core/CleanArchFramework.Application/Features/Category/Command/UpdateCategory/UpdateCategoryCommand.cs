using MediatR;
using Microsoft.AspNetCore.Http;

namespace CleanArchFramework.Application.Features.Category.Command.UpdateCategory
{
    public class UpdateCategoryCommand : IRequest<UpdateCategoryCommandResponse>
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public IFormFile? Image { get; set; }
        public string? Alt { get; set; }
        public int? ParentCategoryId { get; set; }
    }
    
}
