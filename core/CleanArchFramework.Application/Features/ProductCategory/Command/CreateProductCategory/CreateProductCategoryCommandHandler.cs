using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.ProductCategory.Command.CreateProductCategory
{
    public class CreateProductCategoryCommandHandler : IRequestHandler<CreateProductCategoryCommand, CreateProductCategoryCommandResponse>
    {
        private readonly IProductCategoryRepository _productCategoryRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly FileHelper _fileHelper;
        public CreateProductCategoryCommandHandler(IProductCategoryRepository productCategoryRepository, IMapper mapper, IUnitOfWork unitOfWork, FileHelper fileHelper)
        {
            _productCategoryRepository = productCategoryRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;

            _fileHelper = fileHelper;
        }

        public async Task<CreateProductCategoryCommandResponse> Handle(CreateProductCategoryCommand request, CancellationToken cancellationToken)
        {
            var createProductCategoryCommandResponse = new CreateProductCategoryCommandResponse();
            var validator = new CreateProductCategoryCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                createProductCategoryCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    createProductCategoryCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var productCategoryMapped = _mapper.Map<Domain.Entities.ProductCategory>(request);
                var productCategoryImage = await _fileHelper.CreateFileAsync(request.ImageUrl,request.Alt);
         
                productCategoryMapped.Image = productCategoryImage?.Data;
                var productCategory = await _productCategoryRepository.AddAsync(productCategoryMapped);
                await _unitOfWork.SaveAsync(cancellationToken);
                createProductCategoryCommandResponse.Succeed();
                createProductCategoryCommandResponse.Data = _mapper.Map<CreateProductCategoryDto>(productCategory);
                createProductCategoryCommandResponse.Data.DataImage = await _fileHelper.GetBase64String (productCategoryImage?.Data);
                return createProductCategoryCommandResponse;
            }

            return createProductCategoryCommandResponse;
        }
    }
}
