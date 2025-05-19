using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.SiteSettings.Commands.CreateSiteSettings
{
    public class CreateSiteSettingsCommandHandler : IRequestHandler<CreateSiteSettingsCommand, CreateSiteSettingsCommandResponse>
    {
        private readonly ISiteSettingsRepository _siteSettingsRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public CreateSiteSettingsCommandHandler(ISiteSettingsRepository siteSettingsRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _siteSettingsRepository = siteSettingsRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<CreateSiteSettingsCommandResponse> Handle(CreateSiteSettingsCommand request, CancellationToken cancellationToken)
        {
            var createSiteSettingsCommandResponse = new CreateSiteSettingsCommandResponse();
            var validator = new CreateSiteSettingsCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            if (await _siteSettingsRepository.CountRecords(x => true) >= 1)
            {
                createSiteSettingsCommandResponse.WithError("Site section already exist, please update it or add new version!");
                createSiteSettingsCommandResponse.Fail();
                return createSiteSettingsCommandResponse;
            };
            if (validationResult.Errors.Count > 0)
            {
                createSiteSettingsCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    createSiteSettingsCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                createSiteSettingsCommandResponse.Succeed();
                var siteSettings = await _siteSettingsRepository.AddAsync(_mapper.Map<Domain.Entities.SiteSettings>(request));
                await _unitOfWork.SaveAsync(cancellationToken);
                createSiteSettingsCommandResponse.Data = _mapper.Map<CreateSiteSettingsDto>(siteSettings);
                return createSiteSettingsCommandResponse;
            }

            return createSiteSettingsCommandResponse;
        }
    }
}
