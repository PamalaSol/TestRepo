using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Faq.Query.GetAllFaq
{
    public sealed class GetAllFaqQueryHandler : IRequestHandler<GetAllFaqQuery, PagedResult<GetAllFaqDto>>
    {
        private readonly IFaqRepository _faqRepository;
        private readonly IMapper _mapper;

        public GetAllFaqQueryHandler(IMapper mapper,IFaqRepository faqRepository)
        {
            _mapper = mapper;
            _faqRepository = faqRepository;
           
        }

        public async Task<PagedResult<GetAllFaqDto>> Handle(GetAllFaqQuery getAllFaq, CancellationToken cancellationToken)
        {
            var allFaqs = await _faqRepository.GetPagedAndOrderResponseAsync(
                            x => x.IsPublished == getAllFaq.IsPublished && string.IsNullOrEmpty(getAllFaq.QueryOptions.SearchTerm) 
                                                                          || x.Question.Localizations.Any(x=>x.Value.Contains(getAllFaq.QueryOptions.SearchTerm))
                                                                          || x.Answer.Localizations.Any(x=>x.Value.Contains(getAllFaq.QueryOptions.SearchTerm))
                ,
                getAllFaq.QueryOptions, x => x.Id,
                x => x.CreatedDate);

            var result = _mapper.Map<PagedResult<GetAllFaqDto>>(allFaqs);
            result.Succeed();
            return result;
        }
    }
}
