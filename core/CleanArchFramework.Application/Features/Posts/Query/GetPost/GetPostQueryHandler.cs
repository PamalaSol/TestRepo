using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Posts.Query.GetPost
{
    public sealed class GetPostQueryHandler : IRequestHandler<GetPostQuery, Result<GetPostDto>>
    {
        private readonly IPostRepository _postRepository;
        private readonly IMapper _mapper;
        private readonly ILocalizationService _localizationService;
        private readonly FileHelper _fileHelper;
        public GetPostQueryHandler(IMapper mapper, IPostRepository postRepository, ILocalizationService localizationService, FileHelper fileHelper)
        {
            _mapper = mapper;
            _postRepository = postRepository;
            _localizationService = localizationService;
            _fileHelper = fileHelper;
        }

        public async Task<Result<GetPostDto>> Handle(GetPostQuery request, CancellationToken cancellationToken)
        {
            var localization = _localizationService.GetCurrentLanguageId();
            var post = await _postRepository.GetFirstPostNoTrackingAsync(x =>
                x.Id == request.Id && x.Name.Localizations.Any(z => z.LanguageId == localization)
                                   && x.Name.Localizations.Any(z => z.LanguageId == localization)
                                   && x.Name.Localizations.Any(z => z.LanguageId == localization
            ));
            var result = new Result<GetPostDto>();
            result.Data = _mapper.Map<GetPostDto>(post);
            result.Data.DataImage = await _fileHelper.GetBase64String(post.Image);
            result.Succeed();
            return result;
        }
    }
}
