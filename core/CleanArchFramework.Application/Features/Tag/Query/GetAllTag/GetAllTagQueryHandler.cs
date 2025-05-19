using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Tag.Query.GetAllTag
{
    public sealed class GetAllTagQueryHandler : IRequestHandler<GetAllTagQuery, PagedResult<GetAllTagDto>>
    {
        private readonly ITagRepository _tagRepository;
        private readonly IMapper _mapper;

        public GetAllTagQueryHandler(IMapper mapper,ITagRepository tagRepository)
        {
            _mapper = mapper;
            _tagRepository = tagRepository;
           
        }

        public async Task<PagedResult<GetAllTagDto>> Handle(GetAllTagQuery getAllTags, CancellationToken cancellationToken)
        {
            var getTags = await _tagRepository.GetPagedAndOrderResponseAsync(
                x => string.IsNullOrEmpty(getAllTags.QueryOptions.SearchTerm) || x.Name.Contains(getAllTags.QueryOptions.SearchTerm),
                getAllTags.QueryOptions, x => x.Id,
                x => x.CreatedDate);

            var result = _mapper.Map<PagedResult<GetAllTagDto>>(getTags);
            result.Succeed();
            return result;
        }
    }
}
