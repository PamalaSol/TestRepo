using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.FileCategory.Query.GetAllFileCategory
{
    public class GetAllFileCategoryQuery : IRequest<PagedResult<GetAllFileCategoryDto>>
    {
        public QueryOptions QueryOptions { get; set; } = new QueryOptions();
    }
}
