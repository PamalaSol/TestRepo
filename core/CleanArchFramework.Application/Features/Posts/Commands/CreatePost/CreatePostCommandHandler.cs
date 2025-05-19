using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Posts.Commands.CreatePost
{
    public class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, CreatePostCommandResponse>
    {
        private readonly IPostRepository _postRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ITagRepository _tagRepository;
        private readonly FileHelper _fileHelper;

        public CreatePostCommandHandler(IPostRepository postRepository, IMapper mapper, IUnitOfWork unitOfWork, ICategoryRepository categoryRepository, ITagRepository tagRepository, FileHelper fileHelper)
        {
            _postRepository = postRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _categoryRepository = categoryRepository;
            _tagRepository = tagRepository;
            _fileHelper = fileHelper;
        }

        public async Task<CreatePostCommandResponse> Handle(CreatePostCommand request, CancellationToken cancellationToken)
        {
            var createPostCommandResponse = new CreatePostCommandResponse();
            var validator = new CreatePostCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                createPostCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    createPostCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var allCategories = await _categoryRepository.GetAllAsync(x => request.Categories != null && request.Categories.Contains(x.Id));
                var allTags = await _tagRepository.GetAllAsync(x => request.Tags != null && request.Tags.Contains(x.Id));

                var entityPost = _mapper.Map<Domain.Entities.Post>(request);
                entityPost.Categories = allCategories;
                entityPost.Tags = allTags;
                var postImage = await _fileHelper.CreateFileAsync(request.Image, request.Alt);
                entityPost.Image = postImage?.Data;
                var post = await _postRepository.AddAsync(entityPost);
                await _unitOfWork.SaveAsync(cancellationToken);

                createPostCommandResponse.Succeed();
                createPostCommandResponse.Data = _mapper.Map<CreatePostDto>(post);
                createPostCommandResponse.Data.DataImage = await _fileHelper.GetBase64String(post.Image);
                return createPostCommandResponse;
            }

            return createPostCommandResponse;
        }
    }
}
