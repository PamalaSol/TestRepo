using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Product.Commands.CreateProduct
{
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, CreateProductCommandResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProductRepository _productRepository;
        private readonly IProductCategoryRepository _productCategoryRepository;
        private readonly IFileService _fileService;
        private readonly FileHelper _fileHelper;
        private readonly ILocalizationService _localizationService;
        public CreateProductCommandHandler(IMapper mapper, IUnitOfWork unitOfWork, IFileService fileService, FileHelper fileHelper, IProductRepository productRepository, IProductCategoryRepository productCategoryRepository, ILocalizationService localizationService)
        {

            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _fileService = fileService;
            _fileHelper = fileHelper;
            _productRepository = productRepository;
            _productCategoryRepository = productCategoryRepository;
            _localizationService = localizationService;
        }

        public async Task<CreateProductCommandResponse> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var createProductCommandResponse = new CreateProductCommandResponse();
            var validator = new CreateProductCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                createProductCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    createProductCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var allCategories = await _productCategoryRepository.GetAllAsync(x => request.ProductCategories != null && request.ProductCategories.Contains(x.Id));

                var entityProduct = _mapper.Map<Domain.Entities.Product>(request);
                entityProduct.ProductCategories = allCategories;

                var productImages = await _fileHelper.SaveFileSetAsync(request.Images, _localizationService.GetCurrentLanguageId());

                List<FileStorage> listImages = new List<FileStorage>();
                foreach (var imgs in productImages)
                {
                    if (imgs.IsFailed)
                    {
                        createProductCommandResponse.AddErrors(imgs.Errors);
                    }
                    else
                    {
                        listImages.Add(_mapper.Map<FileStorage>(imgs.Data));
                    }
                }
                entityProduct.Images = new FileSet { Files = listImages };
                var productFiles = await _fileHelper.SaveFileSetAsync(request.Files, _localizationService.GetCurrentLanguageId());
                List<FileStorage> listFiles = new List<FileStorage>();
                foreach (var files in productFiles)
                {
                    if (files.IsFailed)
                    {
                        createProductCommandResponse.AddErrors(files.Errors);
                    }
                    else
                    {
                        listFiles.Add(_mapper.Map<FileStorage>(files.Data));
                    }
                }

                entityProduct.Files = new FileSet { Files = listFiles };


                if (entityProduct.Sleeves != null) entityProduct.Sleeves.Clear();
                if (entityProduct.PinchValves != null)
                {
                    entityProduct.PinchValves.Clear();
                }

                var product = await _productRepository.AddAsync(entityProduct);
                    await _unitOfWork.SaveAsync(cancellationToken);

                    if (request.PinchValvesSleeves != null)
                        foreach (var sl in request.PinchValvesSleeves)
                        {
                            if (entityProduct.PinchValves != null)
                                entityProduct.PinchValves.Add(new PinchValveSleeve
                                    { PinchValveId = product.Id, SleeveId = sl.Id, Version = sl.Version });
                        }

                    //if (request.SleevesPinchValves != null)
                    //    foreach (var sl in request.SleevesPinchValves)
                    //    {
                    //        if (entityProduct.PinchValves != null)
                    //            entityProduct.PinchValves.Add(new PinchValveSleeve
                    //                { PinchValveId = sl.Id, Version = sl.Version });
                    //    }

                    await _unitOfWork.SaveAsync(cancellationToken);
                    createProductCommandResponse.Succeed();
                    createProductCommandResponse.Data = _mapper.Map<CreateProductDto>(product);
                

                return createProductCommandResponse;
            }

            return createProductCommandResponse;
        }
    }
}
