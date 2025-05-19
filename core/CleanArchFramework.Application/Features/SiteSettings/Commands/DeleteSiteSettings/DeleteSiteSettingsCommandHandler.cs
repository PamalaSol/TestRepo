using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.SiteSettings.Commands.DeleteSiteSettings
{
    public class DeleteSiteSettingsCommandHandler : IRequestHandler<DeleteSiteSettingsCommand, DeleteSiteSettingsCommandResponse>
    {
        private readonly ISiteSettingsRepository _siteSettingsRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public DeleteSiteSettingsCommandHandler(IMapper mapper, ISiteSettingsRepository siteSettingsRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _siteSettingsRepository = siteSettingsRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeleteSiteSettingsCommandResponse> Handle(DeleteSiteSettingsCommand request, CancellationToken cancellationToken)
        {
            var deleteSiteSettingsCommandResponse = new DeleteSiteSettingsCommandResponse();

            var validator = new DeleteSiteSettingsCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                deleteSiteSettingsCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    deleteSiteSettingsCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                deleteSiteSettingsCommandResponse.Succeed();
                var siteSettings = await _siteSettingsRepository.GetFirstAsync(request.Id);
                siteSettings = await _siteSettingsRepository.DeleteAsync(siteSettings);
                await _unitOfWork.SaveAsync(cancellationToken);
                deleteSiteSettingsCommandResponse.Data = _mapper.Map<DeleteSiteSettingsDto>(siteSettings);
                return deleteSiteSettingsCommandResponse;
            }

            return deleteSiteSettingsCommandResponse;
        }
    }
}
