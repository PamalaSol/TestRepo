using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Tag.Query.GetTag
{
    public class GetTagQuery : IRequest<Result<GetTagDto>>
    {
        public int Id { get; set; }
    }
}
