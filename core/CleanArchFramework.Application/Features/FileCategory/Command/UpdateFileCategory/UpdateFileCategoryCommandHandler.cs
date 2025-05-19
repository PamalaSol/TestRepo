using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.FileCategory.Command.UpdateFileCategory
{
    public class UpdateFileCategoryCommandHandler : IRequestHandler<UpdateFileCategoryCommand, UpdateFileCategoryCommandResponse>
    {
        private readonly IFileCategoryRepository _fileCategoryRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly FileHelper _fileHelper;
        private readonly ILocalizationService _localizationService;
        public UpdateFileCategoryCommandHandler(IMapper mapper, IFileCategoryRepository fileCategoryRepository, IUnitOfWork unitOfWork, FileHelper fileHelper, ILocalizationService localizationService)
        {
            _mapper = mapper;
            _fileCategoryRepository = fileCategoryRepository;
            _unitOfWork = unitOfWork;
            _fileHelper = fileHelper;
            _localizationService = localizationService;
        }

        public async Task<UpdateFileCategoryCommandResponse> Handle(UpdateFileCategoryCommand request, CancellationToken cancellationToken)
        {
            var updateFileCategoryCommandResponse = new UpdateFileCategoryCommandResponse();

            var validator = new UpdateFileCategoryCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            var localization = _localizationService.GetCurrentLanguageId();
            if (validationResult.Errors.Count > 0)
            {
                updateFileCategoryCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    updateFileCategoryCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var fileCategoryImage = await _fileHelper.CreateFileAsync(request.Image,request.Alt,true,7);
                var fileCategoryToUpdate = await _fileCategoryRepository.GetFirstAsync(x => x.Id == request.Id);
                updateFileCategoryCommandResponse.Succeed();

                List<FileStorage> listImages = new List<FileStorage>();
                if (fileCategoryImage != null && fileCategoryImage.IsFailed)
                {
                    updateFileCategoryCommandResponse.AddErrors(fileCategoryImage.Errors);
                }
                else
                {
                    if (fileCategoryImage != null)
                        listImages.Add(_mapper.Map<FileStorage>(fileCategoryImage.Data.Files.FirstOrDefault(x=>x.LanguageId == localization)));
                }

                if (fileCategoryToUpdate?.Image != null && fileCategoryToUpdate?.Image.Files is { Count: >= 0 })
                {
                    foreach (var f in fileCategoryToUpdate.Image?.Files)
                    {
                        if (f.LanguageId != localization)
                        {
                            listImages.Add(f);
                        }

                        if (fileCategoryImage == null && request.Alt != null && f.LanguageId == localization)
                        {
                            f.Alt = request.Alt;
                            listImages.Add(f);
                        }
                    }
                }
                var mapped = _mapper.Map(request, fileCategoryToUpdate);

                var fileCategory = await _fileCategoryRepository.UpdateAsync(mapped);
                fileCategory.Image = new FileSet { Files = listImages };

                await _unitOfWork.SaveAsync(cancellationToken);
                updateFileCategoryCommandResponse.Data = _mapper.Map<UpdateFileCategoryDto>(fileCategory);
                updateFileCategoryCommandResponse.Data.DataImage = await _fileHelper.GetBase64String(fileCategory.Image);
            }

            return updateFileCategoryCommandResponse;
        }
    }
}
