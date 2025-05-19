using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.File.Commands.CreateFile
{
    public class CreateFileCommandHandler : IRequestHandler<CreateFileCommand, CreateFileCommandResponse>
    {
        private readonly IFileStorageRepository _fileRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILocalizationService _localizationService;
        public CreateFileCommandHandler(IMapper mapper, IFileStorageRepository fileRepository, IUnitOfWork unitOfWork, ILocalizationService localizationService)
        {
            _mapper = mapper;
            _fileRepository = fileRepository;
            _unitOfWork = unitOfWork;
            _localizationService = localizationService;
        }

        public async Task<CreateFileCommandResponse> Handle(CreateFileCommand request, CancellationToken cancellationToken)
        {
            var createCategoryCommandResponse = new CreateFileCommandResponse();

            var validator = new CreateFileCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

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
                createCategoryCommandResponse.Succeed();
            }
            if (createCategoryCommandResponse.IsSuccessful)
            {
                var file = _mapper.Map<FileStorage>(request);
                file.LanguageId = _localizationService.GetCurrentLanguageId();

                file = await _fileRepository.AddAsync(file);
                await _unitOfWork.SaveAsync(cancellationToken);
                createCategoryCommandResponse.Data = _mapper.Map<CreateFileDto>(file);
            }

            return createCategoryCommandResponse;
        }
    }
}
