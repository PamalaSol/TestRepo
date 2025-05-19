using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Faq.Query.GetAllFaq
{
    public class GetAllFaqQuery : IRequest<PagedResult<GetAllFaqDto>>
    {
        public QueryOptions QueryOptions { get; set; } = new QueryOptions();
        public bool IsPublished { get; set; } = true;
    }
}
