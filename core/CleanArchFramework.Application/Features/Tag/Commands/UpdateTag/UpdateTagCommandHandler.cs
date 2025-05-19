using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Tag.Commands.UpdateTag
{
    public class UpdateTagCommandHandler : IRequestHandler<UpdateTagCommand, UpdateTagCommandResponse>
    {
        private readonly ITagRepository _tagRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public UpdateTagCommandHandler(IMapper mapper, ITagRepository tagRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _tagRepository = tagRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<UpdateTagCommandResponse> Handle(UpdateTagCommand request, CancellationToken cancellationToken)
        {
            var updateTagCommandResponse = new UpdateTagCommandResponse();

            var validator = new UpdateTagCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                updateTagCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    updateTagCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var tagToUpdate = await _tagRepository.GetFirstAsync(x => x.Id == request.Id);
                updateTagCommandResponse.Succeed();
                var mapped = _mapper.Map(request, tagToUpdate);
                var tag = await _tagRepository.UpdateAsync(mapped);
                await _unitOfWork.SaveAsync(cancellationToken);
                updateTagCommandResponse.Data = _mapper.Map<UpdateTagDto>(tag);
            }

            return updateTagCommandResponse;
        }
    }
}
