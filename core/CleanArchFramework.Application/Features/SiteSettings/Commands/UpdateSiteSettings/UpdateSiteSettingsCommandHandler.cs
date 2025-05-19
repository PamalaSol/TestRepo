using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.SiteSettings.Commands.UpdateSiteSettings
{
    public class UpdateSiteSettingsCommandHandler : IRequestHandler<UpdateSiteSettingsCommand, UpdateSiteSettingsCommandResponse>
    {
        private readonly ISiteSettingsRepository _siteSettingsRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public UpdateSiteSettingsCommandHandler(IMapper mapper, ISiteSettingsRepository siteSettingsRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _siteSettingsRepository = siteSettingsRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<UpdateSiteSettingsCommandResponse> Handle(UpdateSiteSettingsCommand request, CancellationToken cancellationToken)
        {
            var updateSiteSettingsCommandResponse = new UpdateSiteSettingsCommandResponse();

            var validator = new UpdateSiteSettingsCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                updateSiteSettingsCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    updateSiteSettingsCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var siteSettingsToUpdate = await _siteSettingsRepository.GetFirstAsync(x => x.Id == request.Id);
                updateSiteSettingsCommandResponse.Succeed();
                var mapped = _mapper.Map(request, siteSettingsToUpdate);
                var siteSettings = await _siteSettingsRepository.UpdateAsync(mapped);
                await _unitOfWork.SaveAsync(cancellationToken);
                updateSiteSettingsCommandResponse.Data = _mapper.Map<UpdateSiteSettingsDto>(siteSettings);
            }

            return updateSiteSettingsCommandResponse;
        }
    }
}
