using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.About.Command.UpdateAbout
{
    public class UpdateAboutCommandHandler : IRequestHandler<UpdateAboutCommand, UpdateAboutCommandResponse>
    {
        private readonly IAboutRepository _aboutRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly FileHelper _fileHelper;
        private readonly ILocalizationService _localizationService;
        public UpdateAboutCommandHandler(IMapper mapper, IAboutRepository aboutRepository, IUnitOfWork unitOfWork, FileHelper fileHelper, ILocalizationService localizationService)
        {
            _mapper = mapper;
            _aboutRepository = aboutRepository;
            _unitOfWork = unitOfWork;
            _fileHelper = fileHelper;
            _localizationService = localizationService;
        }

        public async Task<UpdateAboutCommandResponse> Handle(UpdateAboutCommand request, CancellationToken cancellationToken)
        {
            var updateAboutCommandResponse = new UpdateAboutCommandResponse();

            var validator = new UpdateAboutCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                updateAboutCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    updateAboutCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var localization = _localizationService.GetCurrentLanguageId();
                var aboutToUpdate = await _aboutRepository.GetFirstAsync(x => x.Id == request.Id && x.InfoText.Localizations.Any(z => z.LanguageId == localization)
                    && x.InfoText.Localizations.Any(z => z.LanguageId == localization)
                    && x.Title.Localizations.Any(z => z.LanguageId == localization));
                updateAboutCommandResponse.Succeed();
                var image = await _fileHelper.CreateFileAsync(request.Image, request.Alt, false);
                //var bckgImage = await _fileHelper.SaveFilesAsync(request.BackgroundImage);

                List<FileStorage> listImages = new List<FileStorage>();

                if (image != null && image.IsFailed)
                {
                    updateAboutCommandResponse.AddErrors(image.Errors);
                }
                else
                {
                    if (image != null)
                        listImages.Add(_mapper.Map<FileStorage>(image.Data.Files.FirstOrDefault(x=>x.LanguageId == localization)));
                }

                if (aboutToUpdate?.Image.Files != null)
                {
                    foreach (var f in aboutToUpdate.Image?.Files)
                    {
                        if (f.LanguageId != localization)
                        {
                            listImages.Add(f);
                        }

                        if (image == null && request.Alt != null && f.LanguageId == localization)
                        {
                            f.Alt = request.Alt;
                            listImages.Add(f);
                        }
                    }
                }
                var mapped = _mapper.Map(request, aboutToUpdate);
                mapped.Image = new FileSet { Files = listImages };
                var menu = await _aboutRepository.UpdateAsync(mapped);
                await _unitOfWork.SaveAsync(cancellationToken);
                updateAboutCommandResponse.Data = _mapper.Map<UpdateAboutDto>(menu);
                updateAboutCommandResponse.Data.DataImage = await _fileHelper.GetBase64String(aboutToUpdate.Image);
            }

            return updateAboutCommandResponse;
        }
    }
}
