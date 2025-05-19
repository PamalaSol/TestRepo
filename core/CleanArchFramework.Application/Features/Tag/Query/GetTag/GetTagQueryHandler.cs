using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Tag.Query.GetTag
{
    public sealed class GetTagQueryHandler : IRequestHandler<GetTagQuery, Result<GetTagDto>>
    {
        private readonly ITagRepository _tagRepository;
        private readonly IMapper _mapper;

        public GetTagQueryHandler(IMapper mapper, ITagRepository TagRepository)
        {
            _mapper = mapper;
            _tagRepository = TagRepository;
        }

        public async Task<Result<GetTagDto>> Handle(GetTagQuery request, CancellationToken cancellationToken)
        {
            var tag = await _tagRepository.GetFirstAsync(x => x.Id == request.Id);
            var result = new Result<GetTagDto>();
            result.Data = _mapper.Map<GetTagDto>(tag);
            result.Succeed();
            return result;
        }
    }
}
