using MediatR;
using Microsoft.AspNetCore.Http;

namespace CleanArchFramework.Application.Features.FileCategory.Command.CreateFileCategory
{
    public class CreateFileCategoryCommand : IRequest<CreateFileCategoryCommandResponse>
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public IFormFile? ImageUrl { get; set; }
        public string? Alt { get; set; }
        public int? ParentFileCategoryId { get; set; }

    }
}
