using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Product.Commands.DeleteProduct
{
    public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, DeleteProductCommandResponse>
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public DeleteProductCommandHandler(IMapper mapper, IProductRepository productRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeleteProductCommandResponse> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        {
            var postCommandResponse = new DeleteProductCommandResponse();

            var validator = new DeleteProductCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                postCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    postCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                postCommandResponse.Succeed();

                var product = await _productRepository.DeleteAsyncById(request.Id);
                await _unitOfWork.SaveAsync(cancellationToken);
                postCommandResponse.Data = _mapper.Map<DeleteProductDto>(product);
                return postCommandResponse;
            }

            return postCommandResponse;
        }
    }
}
