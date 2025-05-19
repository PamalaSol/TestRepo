using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Category.Command.CreateCategory
{
    public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CreateCategoryCommandResponse>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly FileHelper _fileHelper;
        private readonly ILocalizationService _localizationService;
        public CreateCategoryCommandHandler(ICategoryRepository categoryRepository, IMapper mapper, IUnitOfWork unitOfWork, FileHelper fileHelper, ILocalizationService localizationService)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _fileHelper = fileHelper;
            _localizationService = localizationService;
        }

        public async Task<CreateCategoryCommandResponse> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            var createCategoryCommandResponse = new CreateCategoryCommandResponse();
            var validator = new CreateCategoryCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            var localization = _localizationService.GetCurrentLanguageId();
            if (validationResult.Errors.Count > 0)
            {
                createCategoryCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    createCategoryCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var categoryMapped = _mapper.Map<Domain.Entities.Category>(request);
                var categoryImage = await _fileHelper.CreateFileAsync(request.ImageUrl, request.Alt);
                categoryMapped.Image = categoryImage?.Data;

                var category = await _categoryRepository.AddAsync(categoryMapped);
                await _unitOfWork.SaveAsync(cancellationToken);

                createCategoryCommandResponse.Succeed();
                createCategoryCommandResponse.Data = _mapper.Map<CreateCategoryDto>(category);
                createCategoryCommandResponse.Data.DataImage = await _fileHelper.GetBase64String(category.Image);
                return createCategoryCommandResponse;
            }

            return createCategoryCommandResponse;
        }
    }
}
