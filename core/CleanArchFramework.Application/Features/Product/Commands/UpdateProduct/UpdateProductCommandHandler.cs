using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using MapsterMapper;
using MediatR;


namespace CleanArchFramework.Application.Features.Product.Commands.UpdateProduct
{
    public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, UpdateProductCommandResponse>
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILocalizationService _localizationService;
        private readonly IProductCategoryRepository _productCategoryRepository;
        private readonly IFileStorageRepository _fileStorageRepository;
        private readonly FileHelper _fileHelper;

        public UpdateProductCommandHandler(IMapper mapper, IProductRepository productRepository, IUnitOfWork unitOfWork, ILocalizationService localizationService, IProductCategoryRepository categoryRepository, IFileService fileService, FileHelper fileHelper, IFileStorageRepository fileStorageRepository)
        {
            _mapper = mapper;
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
            _localizationService = localizationService;
            _productCategoryRepository = categoryRepository;
            _fileHelper = fileHelper;
            _fileStorageRepository = fileStorageRepository;
        }

        public async Task<UpdateProductCommandResponse> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var updateProductCommandResponse = new UpdateProductCommandResponse();

            var validator = new UpdateProductCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                updateProductCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    updateProductCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var localization = _localizationService.GetCurrentLanguageId();
                updateProductCommandResponse.Succeed();
                var productToUpdate = await _productRepository.GetFirstProductAsync(x => x.Id == request.Id, _localizationService.GetCurrentLanguageId());
                var productImages = await _fileHelper.SaveFileSetAsync(request.Images, localization);
                if (productToUpdate == null)
                {
                    updateProductCommandResponse.Fail();
                    updateProductCommandResponse.AddError("Invalid product id!");
                    return updateProductCommandResponse;
                }
                try
                {
                    await _unitOfWork.BeginTransaction();
                    //var listOfOldImages = new List<FileStorage>();
                    //foreach (var files in productToUpdate?.Images?.Files)
                    //{
                    //    listOfOldImages.Add(files);
                    //}
                    //var listOfOldFiles = new List<FileStorage>();
                    //foreach (var files in productToUpdate?.Files?.Files)
                    //{
                    //    listOfOldFiles.Add(files);
                    //}
                    List<FileStorage> listImages = new List<FileStorage>();

                    foreach (var imgs in productImages)
                    {
                        if (imgs != null && imgs.IsFailed)
                        {
                            updateProductCommandResponse.AddErrors(imgs.Errors);
                        }
                        else
                        {
                            if (imgs != null)
                            {
                                var mappedImg = _mapper.Map<FileStorage>(imgs.Data);
                                mappedImg.FileSetId = productToUpdate.ImagesId;
                                listImages.Add(mappedImg);
                            }
                        }
                    }
                    //if (productToUpdate.Images?.Files != null)
                    //{
                    //    foreach (var i in productToUpdate.Images?.Files)
                    //    {
                    //        if (i.LanguageId != localization || request.Images == null)
                    //        {
                    //            listImages.Add(i);
                    //        }
                    //    }
                    //}
                    productToUpdate.ProductCategories?.Clear();
                    //   productToUpdate.Images.Files = listImages;
                    var mapped = _mapper.Map(request, productToUpdate);
                    mapped.Images = new FileSet { Files = listImages };
                    productToUpdate.Images = mapped.Images;
                    var productFiles = await _fileHelper.SaveFileSetAsync(request.Files, localization);
                    List<FileStorage> listFiles = new List<FileStorage>();
                    foreach (var files in productFiles)
                    {
                        if (files.IsFailed)
                        {
                            updateProductCommandResponse.AddErrors(files.Errors);
                        }
                        else
                        {
                            if (files != null)
                            {
                                var mappedFile = _mapper.Map<FileStorage>(files.Data);
                                mappedFile.FileSetId = productToUpdate.FilesId;
                                listImages.Add(mappedFile);
                            };
                        }
                    }

                    if (productToUpdate.Files?.Files != null)
                    {
                        foreach (var f in productToUpdate.Files?.Files)
                        {
                            if (f.LanguageId != localization || request.Images == null)
                            {
                                listFiles.Add(f);
                            }
                        }
                    }
                    mapped.Files = new FileSet { Files = listFiles, Id = new Guid() };
                    var selectedCategoryIds = request.ProductCategories;


                    // Load the product without tracking to detach it from the context
                    if (productToUpdate != null)
                    {
                        // Clear existing product categories
                        productToUpdate.ProductCategories?.Clear();


                        productToUpdate.Sleeves?.Clear();
                        productToUpdate.PinchValves?.Clear();


                        // Save changes to remove existing associations
                        _productRepository.UpdateAsync(mapped);
                        await _unitOfWork.SaveAsync(cancellationToken);

                        // Add new product categories
                        if (selectedCategoryIds != null)
                            foreach (var categoryId in selectedCategoryIds)
                            {
                                var category = await _productCategoryRepository.GetFirstAsync(categoryId);

                                if (category != null)
                                {
                                    productToUpdate.ProductCategories?.Add(category);
                                }
                            }


                        if (request.PinchValvesSleeves != null)
                            foreach (var sl in request.PinchValvesSleeves)
                            {
                                if (productToUpdate.PinchValves != null)
                                    productToUpdate.PinchValves.Add(new PinchValveSleeve
                                    { PinchValveId = productToUpdate.Id, SleeveId = sl.Id, Version = sl.Version });
                            }

                        // Attach the product back to the context for update
                        //  _productRepository.Update(productToUpdate);

                        // Save changes to persist the updates to the database
                        //await _unitOfWork.SaveAsync(cancellationToken);

                        //Update Images
                        //_fileStorageRepository.DeleteRangeAsync(listOfOldImages);
                        //await _unitOfWork.SaveAsync(cancellationToken);

                        foreach (var i in mapped.Images.Files)
                        {
                            await _fileStorageRepository.AddAsync(i);
                        }
                        //await _unitOfWork.SaveAsync(cancellationToken);

                        //Update Files
                        //_fileStorageRepository.DeleteRangeAsync(listOfOldFiles);
                        //await _unitOfWork.SaveAsync(cancellationToken);

                        foreach (var f in mapped.Files.Files)
                        {
                            await _fileStorageRepository.AddAsync(f);
                        }
                        await _unitOfWork.SaveAsync(cancellationToken);

                    }
                    await _unitOfWork.CommitTransaction();

                    updateProductCommandResponse.Data = _mapper.Map<UpdateProductDto>(mapped);
                }
                catch (Exception)
                {
                    await _unitOfWork.RollBackTransaction();
                    throw;
                }

            }

            return updateProductCommandResponse;
        }
    }
}
