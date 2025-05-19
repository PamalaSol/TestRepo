using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.Faq.Query.GetFaq
{
    public class GetFaqQuery : IRequest<Result<GetFaqDto>>
    {
        public int Id { get; set; }
    }
}
