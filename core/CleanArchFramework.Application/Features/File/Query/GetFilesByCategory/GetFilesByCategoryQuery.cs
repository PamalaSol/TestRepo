using CleanArchFramework.Application.Features.File.Query.GetFile;
using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.File.Query.GetFilesByCategory
{
    public class GetFilesByCategoryQuery : IRequest<PagedResult<GetFileDto>>
    {
        public List<int> Id { get; set; }
        public QueryOptions QueryOptions { get; set; } = new QueryOptions();

    }
}
