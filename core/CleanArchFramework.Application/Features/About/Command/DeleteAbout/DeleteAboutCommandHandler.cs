using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.About.Command.DeleteAbout
{
    public class AboutCommandHandler : IRequestHandler<DeleteAboutCommand, DeleteAboutCommandResponse>
    {
        private readonly IAboutRepository _aboutRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public AboutCommandHandler(IMapper mapper, IAboutRepository aboutRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _aboutRepository = aboutRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeleteAboutCommandResponse> Handle(DeleteAboutCommand request, CancellationToken cancellationToken)
        {
            var aboutCommandResponse = new DeleteAboutCommandResponse();

            var validator = new AboutCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                aboutCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    aboutCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                aboutCommandResponse.Succeed();
                var menu = await _aboutRepository.GetFirstAsync(request.Id);
                menu = await _aboutRepository.DeleteAsync(menu);
                await _unitOfWork.SaveAsync(cancellationToken);
                aboutCommandResponse.Data = _mapper.Map<DeleteAboutDto>(menu);
                return aboutCommandResponse;
            }

            return aboutCommandResponse;
        }
    }
}
