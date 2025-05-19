using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Faq.Commands.DeleteFaq
{
    public class DeleteFaqCommandHandler : IRequestHandler<DeleteFaqCommand, DeleteFaqCommandResponse>
    {
        private readonly IFaqRepository _faqRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public DeleteFaqCommandHandler(IMapper mapper, IFaqRepository faqRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _faqRepository = faqRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeleteFaqCommandResponse> Handle(DeleteFaqCommand request, CancellationToken cancellationToken)
        {
            var deleteFaqCommandResponse = new DeleteFaqCommandResponse();

            var validator = new DeleteFaqCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                deleteFaqCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    deleteFaqCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                deleteFaqCommandResponse.Succeed();
                var faq = await _faqRepository.GetFirstAsync(request.Id);
                faq = await _faqRepository.DeleteAsync(faq);
                await _unitOfWork.SaveAsync(cancellationToken);
                deleteFaqCommandResponse.Data = _mapper.Map<DeleteFaqDto>(faq);
                return deleteFaqCommandResponse;
            }

            return deleteFaqCommandResponse;
        }
    }
}
