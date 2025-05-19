using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Tag.Commands.CreateTag
{
    public class CreateTagCommandHandler : IRequestHandler<CreateTagCommand, CreateTagCommandResponse>
    {
        private readonly ITagRepository _tagRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public CreateTagCommandHandler(ITagRepository tagRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _tagRepository = tagRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<CreateTagCommandResponse> Handle(CreateTagCommand request, CancellationToken cancellationToken)
        {
            var createTagCommandResponse = new CreateTagCommandResponse();
            var validator = new CreateTagCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                createTagCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    createTagCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                createTagCommandResponse.Succeed();
                var tag = await _tagRepository.AddAsync(_mapper.Map<Domain.Entities.Tag>(request));
                await _unitOfWork.SaveAsync(cancellationToken);
                createTagCommandResponse.Data = _mapper.Map<CreateTagDto>(tag);
                return createTagCommandResponse;
            }

            return createTagCommandResponse;
        }
    }
}
