using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.ProductCategory.Command.UpdateProductCategory
{
    public class UpdateProductCategoryCommandHandler : IRequestHandler<UpdateProductCategoryCommand, UpdateProductCategoryCommandResponse>
    {
        private readonly IProductCategoryRepository _productCategoryRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        private readonly FileHelper _fileHelper;
        private readonly ILocalizationService _localizationService;
        public UpdateProductCategoryCommandHandler(IMapper mapper, IProductCategoryRepository productCategoryRepository, IUnitOfWork unitOfWork, FileHelper fileHelper, ILocalizationService localizationService)
        {
            _mapper = mapper;
            _productCategoryRepository = productCategoryRepository;
            _unitOfWork = unitOfWork;

            _fileHelper = fileHelper;
            _localizationService = localizationService;
        }

        public async Task<UpdateProductCategoryCommandResponse> Handle(UpdateProductCategoryCommand request, CancellationToken cancellationToken)
        {
            var updateProductCategoryCommandResponse = new UpdateProductCategoryCommandResponse();

            var validator = new UpdateProductCategoryCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            var localization = _localizationService.GetCurrentLanguageId();
            if (validationResult.Errors.Count > 0)
            {
                updateProductCategoryCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    updateProductCategoryCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var productCategoryImage = await _fileHelper.CreateFileAsync(request.Image,request.Alt);
                var productCategoryToUpdate = await _productCategoryRepository.GetFirstAsync(x => x.Id == request.Id);
                updateProductCategoryCommandResponse.Succeed();

                var mapped = _mapper.Map(request, productCategoryToUpdate);
                List<FileStorage> listImages = new List<FileStorage>();
                if (productCategoryImage != null && productCategoryImage.IsFailed)
                {
                    updateProductCategoryCommandResponse.AddErrors(productCategoryImage.Errors);
                }
                else
                {
                    if (productCategoryImage != null)
                        listImages.Add(_mapper.Map<FileStorage>(productCategoryImage.Data.Files.FirstOrDefault(x=>x.LanguageId == localization)));
                }

                if (productCategoryToUpdate?.Image != null && productCategoryToUpdate?.Image.Files is { Count: >= 0 })
                {
                    foreach (var f in productCategoryToUpdate.Image?.Files)
                    {
                        if (f.LanguageId != localization)
                        {
                            listImages.Add(f);
                        }

                        if (productCategoryImage == null && request.Alt != null && f.LanguageId == localization)
                        {
                            f.Alt = request.Alt;
                            listImages.Add(f);
                        }
                    }
                }
                var productCategory = await _productCategoryRepository.UpdateAsync(mapped);
                productCategory.Image = new FileSet { Files = listImages };

                await _unitOfWork.SaveAsync(cancellationToken);
                updateProductCategoryCommandResponse.Data = _mapper.Map<UpdateProductCategoryDto>(productCategory);
                updateProductCategoryCommandResponse.Data.DataImage = await _fileHelper.GetBase64String(productCategory.Image);
            }

            return updateProductCategoryCommandResponse;
        }
    }
}
