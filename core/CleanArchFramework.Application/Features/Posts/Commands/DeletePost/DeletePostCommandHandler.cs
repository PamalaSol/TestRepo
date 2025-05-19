using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Posts.Commands.DeletePost
{
    public class PostCommandHandler : IRequestHandler<DeletePostCommand, DeletePostCommandResponse>
    {
        private readonly IPostRepository _postRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public PostCommandHandler(IMapper mapper, IPostRepository postRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _postRepository = postRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeletePostCommandResponse> Handle(DeletePostCommand request, CancellationToken cancellationToken)
        {
            var postCommandResponse = new DeletePostCommandResponse();

            var validator = new PostCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                postCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    postCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                postCommandResponse.Succeed();
                var menu = await _postRepository.GetFirstAsync(request.Id);
                menu = await _postRepository.DeleteAsync(menu);
                await _unitOfWork.SaveAsync(cancellationToken);
                postCommandResponse.Data = _mapper.Map<DeletePostDto>(menu);
                return postCommandResponse;
            }

            return postCommandResponse;
        }
    }
}
