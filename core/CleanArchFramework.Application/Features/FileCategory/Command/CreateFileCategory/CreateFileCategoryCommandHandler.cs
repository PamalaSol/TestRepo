using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.FileCategory.Command.CreateFileCategory
{
    public class CreateFileCategoryCommandHandler : IRequestHandler<CreateFileCategoryCommand, CreateFileCategoryCommandResponse>
    {
        private readonly IFileCategoryRepository _fileCategoryRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly FileHelper _fileHelper;
        public CreateFileCategoryCommandHandler(IFileCategoryRepository fileCategoryRepository, IMapper mapper, IUnitOfWork unitOfWork, FileHelper fileHelper)
        {
            _fileCategoryRepository = fileCategoryRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _fileHelper = fileHelper;
        }

        public async Task<CreateFileCategoryCommandResponse> Handle(CreateFileCategoryCommand request, CancellationToken cancellationToken)
        {
            var createFileCategoryCommandResponse = new CreateFileCategoryCommandResponse();
            var validator = new CreateFileCategoryCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                createFileCategoryCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    createFileCategoryCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var fileCategoryMapped = _mapper.Map<Domain.Entities.FileCategory>(request);
                var fileCategoryImage = await _fileHelper.CreateFileAsync(request.ImageUrl,request.Alt,true,7);
         
                fileCategoryMapped.Image = fileCategoryImage?.Data;
                var fileCategory = await _fileCategoryRepository.AddAsync(fileCategoryMapped);
                await _unitOfWork.SaveAsync(cancellationToken);
                createFileCategoryCommandResponse.Succeed();
                createFileCategoryCommandResponse.Data = _mapper.Map<CreateFileCategoryDto>(fileCategory);
                createFileCategoryCommandResponse.Data.DataImage = await _fileHelper.GetBase64String (fileCategoryImage?.Data);
                return createFileCategoryCommandResponse;
            }

            return createFileCategoryCommandResponse;
        }
    }
}
