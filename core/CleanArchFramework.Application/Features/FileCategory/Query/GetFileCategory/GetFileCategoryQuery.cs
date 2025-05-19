using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.FileCategory.Query.GetFileCategory
{
    public class GetFileCategoryQuery : IRequest<Result<GetFileCategoryDto>>
    {
        public int Id { get; set; }
    }
}
