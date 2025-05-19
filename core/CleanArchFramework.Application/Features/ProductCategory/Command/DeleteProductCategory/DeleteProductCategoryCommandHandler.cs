using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.ProductCategory.Command.DeleteProductCategory
{
    public class DeleteProductCategoryCommandHandler : IRequestHandler<DeleteProductCategoryCommand, DeleteProductCategoryCommandResponse>
    {
        private readonly IProductCategoryRepository _productCategoryRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public DeleteProductCategoryCommandHandler(IMapper mapper, IProductCategoryRepository productCategoryRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _productCategoryRepository = productCategoryRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeleteProductCategoryCommandResponse> Handle(DeleteProductCategoryCommand request, CancellationToken cancellationToken)
        {
            var deleteProductCategoryCommandResponse = new DeleteProductCategoryCommandResponse();

            var validator = new DeleteProductCategoryCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                deleteProductCategoryCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    deleteProductCategoryCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                deleteProductCategoryCommandResponse.Succeed();
                var menu = await _productCategoryRepository.GetFirstAsync(request.Id);
                menu = await _productCategoryRepository.DeleteAsync(menu);
                await _unitOfWork.SaveAsync(cancellationToken);
                deleteProductCategoryCommandResponse.Data = _mapper.Map<DeleteProductCategoryDto>(menu);
                return deleteProductCategoryCommandResponse;
            }

            return deleteProductCategoryCommandResponse;
        }
    }
}
