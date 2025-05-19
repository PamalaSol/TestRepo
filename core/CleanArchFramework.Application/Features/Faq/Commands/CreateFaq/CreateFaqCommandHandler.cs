using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Faq.Commands.CreateFaq
{
    public class CreateFaqCommandHandler : IRequestHandler<CreateFaqCommand, CreateFaqCommandResponse>
    {
        private readonly IFaqRepository _faqRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public CreateFaqCommandHandler(IFaqRepository faqRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _faqRepository = faqRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<CreateFaqCommandResponse> Handle(CreateFaqCommand request, CancellationToken cancellationToken)
        {
            var createFaqCommandResponse = new CreateFaqCommandResponse();
            var validator = new CreateFaqCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                createFaqCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    createFaqCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                createFaqCommandResponse.Succeed();
                var faq = await _faqRepository.AddAsync(_mapper.Map<Domain.Entities.Faq>(request));
                await _unitOfWork.SaveAsync(cancellationToken);
                createFaqCommandResponse.Data = _mapper.Map<CreateFaqDto>(faq);
                return createFaqCommandResponse;
            }

            return createFaqCommandResponse;
        }
    }
}
