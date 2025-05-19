using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Category.Command.UpdateCategory
{
    public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, UpdateCategoryCommandResponse>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly FileHelper _fileHelper;
        private readonly ILocalizationService _localizationService;
        public UpdateCategoryCommandHandler(IMapper mapper, ICategoryRepository categoryRepository, IUnitOfWork unitOfWork, FileHelper fileHelper, ILocalizationService localizationService)
        {
            _mapper = mapper;
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
           
            _fileHelper = fileHelper;
            _localizationService = localizationService;
        }

        public async Task<UpdateCategoryCommandResponse> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var updateCategoryCommandResponse = new UpdateCategoryCommandResponse();

            var validator = new UpdateCategoryCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            var localization = _localizationService.GetCurrentLanguageId();
            if (validationResult.Errors.Count > 0)
            {
                updateCategoryCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    updateCategoryCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var categoryImage = await _fileHelper.CreateFileAsync(request.Image, request.Alt, false);

                var categoryToUpdate = await _categoryRepository.GetFirstAsync(x => x.Id == request.Id);
                updateCategoryCommandResponse.Succeed();

                List<FileStorage> listImages = new List<FileStorage>();

                if (categoryImage != null && categoryImage.IsFailed)
                {
                    updateCategoryCommandResponse.AddErrors(categoryImage.Errors);
                }
                else
                {
                    if (categoryImage != null)
                        listImages.Add(_mapper.Map<FileStorage>(categoryImage.Data.Files.FirstOrDefault(x => x.LanguageId == localization)));
                }

                if (categoryToUpdate?.Image != null && categoryToUpdate?.Image.Files is { Count: >= 0 })
                {
                    foreach (var f in categoryToUpdate.Image?.Files)
                    {
                        if (f.LanguageId != localization)
                        {
                            listImages.Add(f);
                        }

                        if (categoryImage == null && request.Alt != null && f.LanguageId == localization)
                        {
                            f.Alt = request.Alt;
                            listImages.Add(f);
                        }
                    }
                }
                var mapped = _mapper.Map(request, categoryToUpdate);

                mapped.Image = new FileSet { Files = listImages };

                var category = await _categoryRepository.UpdateAsync(mapped);
                await _unitOfWork.SaveAsync(cancellationToken);
                updateCategoryCommandResponse.Data = _mapper.Map<UpdateCategoryDto>(category);
                updateCategoryCommandResponse.Data.DataImage = await _fileHelper.GetBase64String(category.Image);
            }

            return updateCategoryCommandResponse;
        }
    }
}
