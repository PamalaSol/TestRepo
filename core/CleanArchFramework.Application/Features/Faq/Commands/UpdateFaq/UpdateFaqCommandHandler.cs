using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Faq.Commands.UpdateFaq
{
    public class UpdateFaqCommandHandler : IRequestHandler<UpdateFaqCommand, UpdateFaqCommandResponse>
    {
        private readonly IFaqRepository _faqRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILocalizationService _localizationService;
        public UpdateFaqCommandHandler(IMapper mapper, IFaqRepository faqRepository, IUnitOfWork unitOfWork, ILocalizationService localizationService)
        {
            _mapper = mapper;
            _faqRepository = faqRepository;
            _unitOfWork = unitOfWork;
            _localizationService = localizationService;
        }

        public async Task<UpdateFaqCommandResponse> Handle(UpdateFaqCommand request, CancellationToken cancellationToken)
        {
            var updateFaqCommandResponse = new UpdateFaqCommandResponse();

            var validator = new UpdateFaqCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                updateFaqCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    updateFaqCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var localization = _localizationService.GetCurrentLanguageId();
                var faqToUpdate = await _faqRepository.GetFirstAsync(x => x.Id == request.Id  && x.Question.Localizations.Any(z => z.LanguageId == localization)
                    && x.Question.Localizations.Any(z => z.LanguageId == localization)
                );
                updateFaqCommandResponse.Succeed();
                var mapped = _mapper.Map(request, faqToUpdate);
                var faq = await _faqRepository.UpdateAsync(mapped);
                await _unitOfWork.SaveAsync(cancellationToken);
                updateFaqCommandResponse.Data = _mapper.Map<UpdateFaqDto>(faq);
            }

            return updateFaqCommandResponse;
        }
    }
}
