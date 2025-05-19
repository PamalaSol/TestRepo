using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Tag.Commands.DeleteTag
{
    public class DeleteTagCommandHandler : IRequestHandler<DeleteTagCommand, DeleteTagCommandResponse>
    {
        private readonly ITagRepository _tagRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public DeleteTagCommandHandler(IMapper mapper, ITagRepository tagRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _tagRepository = tagRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeleteTagCommandResponse> Handle(DeleteTagCommand request, CancellationToken cancellationToken)
        {
            var deleteTagCommandResponse = new DeleteTagCommandResponse();

            var validator = new DeleteTagCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                deleteTagCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    deleteTagCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                deleteTagCommandResponse.Succeed();
                var deleteTag = await _tagRepository.GetFirstAsync(request.Id);
                deleteTag = await _tagRepository.DeleteAsync(deleteTag);
                await _unitOfWork.SaveAsync(cancellationToken);
                deleteTagCommandResponse.Data = _mapper.Map<DeleteTagDto>(deleteTag);
                return deleteTagCommandResponse;
            }

            return deleteTagCommandResponse;
        }
    }
}
