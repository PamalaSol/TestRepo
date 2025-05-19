using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Posts.Query.GetAllPost
{
    public sealed class GetAllPostQueryHandler : IRequestHandler<GetAllPostQuery, PagedResult<GetAllPostDto>>
    {
        private readonly IPostRepository _postRepository;
        private readonly IMapper _mapper;
        private readonly IFileService _fileService;
        private readonly FileHelper _fileHelper;

        public GetAllPostQueryHandler(IMapper mapper,IPostRepository postRepository, IFileService fileService, FileHelper fileHelper)
        {
            _mapper = mapper;
            _postRepository = postRepository;
            _fileService = fileService;
            _fileHelper = fileHelper;
        }

        public async Task<PagedResult<GetAllPostDto>> Handle(GetAllPostQuery getAllPost, CancellationToken cancellationToken)
        {
            var allPost = await _postRepository.GetPagedPostAndOrderResponseAsync(
                x => string.IsNullOrEmpty(getAllPost.QueryOptions.SearchTerm) || x.Name.Localizations.Any(x=>x.Value.Contains(getAllPost.QueryOptions.SearchTerm
                )),
                getAllPost.QueryOptions, x => x.Id,
                x => x.CreatedDate);
            
            var result = _mapper.Map<PagedResult<GetAllPostDto>>(allPost);
            result.Data = new List<GetAllPostDto>();
            foreach (Post post in allPost.Data)
            {
                GetAllPostDto postMapped = _mapper.Map<GetAllPostDto>(post);
                postMapped.DataImage = await _fileHelper.GetBase64String(post.Image);
                result.Data.Add(postMapped);
            }
            result.Succeed();
            return result;
        }
    }
}
