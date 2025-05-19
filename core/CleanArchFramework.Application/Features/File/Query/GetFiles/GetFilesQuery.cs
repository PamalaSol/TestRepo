using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.File.Query.GetFile
{
    public class GetFilesQuery : IRequest<Result<GetFilesDto>>
    {
        public List<Guid> Id { get; set; }
    }
}
