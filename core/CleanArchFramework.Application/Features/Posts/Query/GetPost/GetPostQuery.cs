using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Posts.Query.GetPost
{
    public class GetPostQuery : IRequest<Result<GetPostDto>>
    {
        public Guid Id { get; set; }
    }
}
