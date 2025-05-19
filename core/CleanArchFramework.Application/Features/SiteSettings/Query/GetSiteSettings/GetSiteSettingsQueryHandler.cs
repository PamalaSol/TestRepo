using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.SiteSettings.Query.GetSiteSettings
{
    public sealed class GetSiteSettingsQueryHandler : IRequestHandler<GetSiteSettingsQuery, Result<GetSiteSettingsDto>>
    {
        private readonly ISiteSettingsRepository _siteSettingsRepository;
        private readonly IMapper _mapper;

        public GetSiteSettingsQueryHandler(IMapper mapper, ISiteSettingsRepository siteSettingsRepository)
        {
            _mapper = mapper;
            _siteSettingsRepository = siteSettingsRepository;
        }

        public async Task<Result<GetSiteSettingsDto>> Handle(GetSiteSettingsQuery request, CancellationToken cancellationToken)
        {
            var allSiteSettings = await _siteSettingsRepository.GetFirstAsync(x => true); ;
            var result = new Result<GetSiteSettingsDto>();
            result.Data = _mapper.Map<GetSiteSettingsDto>(allSiteSettings);
            result.Succeed();
            return result;
        }
    }
}
