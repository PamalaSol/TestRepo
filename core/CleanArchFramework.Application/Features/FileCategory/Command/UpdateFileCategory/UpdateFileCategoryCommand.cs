using MediatR;
using Microsoft.AspNetCore.Http;

namespace CleanArchFramework.Application.Features.FileCategory.Command.UpdateFileCategory
{
    public class UpdateFileCategoryCommand : IRequest<UpdateFileCategoryCommandResponse>
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public IFormFile? Image { get; set; }
        public string? Alt { get; set; }
        public int? ParentFileCategoryId { get; set; }
    }
    
}
