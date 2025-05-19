using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Faq.Query.GetFaq
{
    public sealed class GetFaqQueryHandler : IRequestHandler<GetFaqQuery, Result<GetFaqDto>>
    {
        private readonly IFaqRepository _faqRepository;
        private readonly IMapper _mapper;

        public GetFaqQueryHandler(IMapper mapper, IFaqRepository faqRepository)
        {
            _mapper = mapper;
            _faqRepository = faqRepository;
        }

        public async Task<Result<GetFaqDto>> Handle(GetFaqQuery request, CancellationToken cancellationToken)
        {
            var allFaqs = await _faqRepository.GetFirstAsync(x => x.Id == request.Id);
            var result = new Result<GetFaqDto>();
            result.Data = _mapper.Map<GetFaqDto>(allFaqs);
            result.Succeed();
            return result;
        }
    }
}
