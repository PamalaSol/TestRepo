using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.File.Commands.DeleteFile
{
    public class DeleteFileCommandHandler : IRequestHandler<DeleteFileCommand, DeleteFileCommandResponse>
    {
        private readonly IFileStorageRepository _fileRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteFileCommandHandler(IMapper mapper, IFileStorageRepository fileRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _fileRepository = fileRepository;
            _unitOfWork = unitOfWork;

        }

        public async Task<DeleteFileCommandResponse> Handle(DeleteFileCommand request, CancellationToken cancellationToken)
        {
            var deleteFileCommandResponse = new DeleteFileCommandResponse();

            var validator = new DeleteFileCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                deleteFileCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    deleteFileCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                deleteFileCommandResponse.Succeed();
            }
            if (deleteFileCommandResponse.IsSuccessful)
            {
                var file = await _fileRepository.GetFirstAsync(request.Id);
                file = await _fileRepository.DeleteAsync(file);
                await _unitOfWork.SaveAsync(cancellationToken);

                deleteFileCommandResponse.Data = _mapper.Map<DeleteFileDto>(file);
            }

            return deleteFileCommandResponse;
        }
    }
}
