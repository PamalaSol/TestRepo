using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.FileCategory.Command.DeleteFileCategory
{
    public class DeleteFileCategoryCommandHandler : IRequestHandler<DeleteFileCategoryCommand, DeleteFileCategoryCommandResponse>
    {
        private readonly IFileCategoryRepository _fileCategoryRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public DeleteFileCategoryCommandHandler(IMapper mapper, IFileCategoryRepository fileCategoryRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _fileCategoryRepository = fileCategoryRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeleteFileCategoryCommandResponse> Handle(DeleteFileCategoryCommand request, CancellationToken cancellationToken)
        {
            var deleteFileCategoryCommandResponse = new DeleteFileCategoryCommandResponse();

            var validator = new DeleteFileCategoryCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                deleteFileCategoryCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    deleteFileCategoryCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                deleteFileCategoryCommandResponse.Succeed();
                var menu = await _fileCategoryRepository.GetFirstAsync(request.Id);
                menu = await _fileCategoryRepository.DeleteAsync(menu);
                await _unitOfWork.SaveAsync(cancellationToken);
                deleteFileCategoryCommandResponse.Data = _mapper.Map<DeleteFileCategoryDto>(menu);
                return deleteFileCategoryCommandResponse;
            }

            return deleteFileCategoryCommandResponse;
        }
    }
}
