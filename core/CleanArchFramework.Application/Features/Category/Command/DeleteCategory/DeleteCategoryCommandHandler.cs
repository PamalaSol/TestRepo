using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Category.Command.DeleteCategory
{
    public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, DeleteCategoryCommandResponse>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public DeleteCategoryCommandHandler(IMapper mapper, ICategoryRepository categoryRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeleteCategoryCommandResponse> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            var deleteCategoryCommandResponse = new DeleteCategoryCommandResponse();

            var validator = new DeleteCategoryCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                deleteCategoryCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    deleteCategoryCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                deleteCategoryCommandResponse.Succeed();
                var menu = await _categoryRepository.GetFirstAsync(request.Id);
                menu = await _categoryRepository.DeleteAsync(menu);
                await _unitOfWork.SaveAsync(cancellationToken);
                deleteCategoryCommandResponse.Data = _mapper.Map<DeleteCategoryDto>(menu);
                return deleteCategoryCommandResponse;
            }

            return deleteCategoryCommandResponse;
        }
    }
}
