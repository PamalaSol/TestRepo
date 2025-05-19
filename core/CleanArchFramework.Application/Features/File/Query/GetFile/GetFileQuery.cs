using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.File.Query.GetFile
{
    public class GetFileQuery : IRequest<Result<GetFileDto>>
    {
        public Guid? Id { get; set; }
    }
}
