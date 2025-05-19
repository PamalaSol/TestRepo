using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.About.Command.CreateAbout
{
    public class CreateAboutCommandHandler : IRequestHandler<CreateAboutCommand, CreateAboutCommandResponse>
    {
        private readonly IAboutRepository _aboutRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly FileHelper _fileHelper;
        public CreateAboutCommandHandler(IAboutRepository aboutRepository, IMapper mapper, IUnitOfWork unitOfWork, FileHelper fileHelper, IFileService fileService)
        {
            _aboutRepository = aboutRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _fileHelper = fileHelper;
        }

        public async Task<CreateAboutCommandResponse> Handle(CreateAboutCommand request, CancellationToken cancellationToken)
        {
            var createAboutCommandResponse = new CreateAboutCommandResponse();
            var validator = new CreateAboutCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            if (await _aboutRepository.CountRecords(x => true) >= 1)
            {
                createAboutCommandResponse.WithError("About section already exist!");
                createAboutCommandResponse.Fail();
                return createAboutCommandResponse;
            };
            if (validationResult.Errors.Count > 0)
            {
                createAboutCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    createAboutCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                createAboutCommandResponse.Succeed();
                //var image = await _fileHelper.CreateFileAsync(request.Image);
                var categoryImage = await _fileHelper.CreateFileAsync(request.Image, request.Alt);

                //var bckgImage = await _fileHelper.SaveFilesAsync(request.BackgroundImage);
                var about = _mapper.Map<Domain.Entities.About>(request);
                //     about.BackgroundImage = null;
                about.Image = categoryImage?.Data;
                //about.BackgroundImageId = bckgImage?.Data.Id;
                about = await _aboutRepository.AddAsync(about);
                await _unitOfWork.SaveAsync(cancellationToken);
                createAboutCommandResponse.Data = _mapper.Map<CreateAboutDto>(about);
                createAboutCommandResponse.Data.DataImage = await _fileHelper.GetBase64String(about.Image);
                //  createAboutCommandResponse.Data.DataBackgroundImage = await _fileService.GetBase64File(bckgImage?.Data?.FileGuid.ToString() ?? null, bckgImage?.Data?.FileExtension);
                return createAboutCommandResponse;
            }

            return createAboutCommandResponse;
        }
    }
}
