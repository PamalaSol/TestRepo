using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Category.Query.GetCategory
{
    public class GetCategoryQuery : IRequest<Result<GetCategoryDto>>
    {
        public int Id { get; set; }
    }
}
