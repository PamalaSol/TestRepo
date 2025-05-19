using MediatR;
using Microsoft.AspNetCore.Http;

namespace CleanArchFramework.Application.Features.Posts.Commands.UpdatePost
{
    public class UpdatePostCommand : IRequest<UpdatePostCommandResponse>
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Keywords { get; set; }
        public required string Content { get; set; }
        public bool IsFeatured { get; set; }
        public IFormFile? Image { get; set; }
        public string? Alt { get; set; }
        public List<int>? Categories { get; set; }
        public List<int>? Tags { get; set; }

    }

}
