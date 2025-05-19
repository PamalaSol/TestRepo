using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Features.File.Query.GetFile;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.File.Query.GetFilesByCategory
{
    public sealed class GetFileByCategoryQueryHandler : IRequestHandler<GetFilesByCategoryQuery, PagedResult<GetFileDto>>
    {
        private readonly IFileStorageRepository _fileRepository;
        private readonly IMapper _mapper;
        private readonly ILocalizationService _localizationService;
        public GetFileByCategoryQueryHandler(IMapper mapper, IFileStorageRepository fileRepository, ILocalizationService localizationService)
        {
            _mapper = mapper;
            _fileRepository = fileRepository;
            _localizationService = localizationService;
        }

        public async Task<PagedResult<GetFileDto>> Handle(GetFilesByCategoryQuery request, CancellationToken cancellationToken)
        {
            // Fetch data from the database
            var allFiles = await _fileRepository.GetPagedAndOrderResponseAsync(x =>
                request.Id.Contains((int)x.FileCategoryId) &&
                x.LanguageId == _localizationService.GetCurrentLanguageId(), request.QueryOptions);
            var result = new PagedResult<GetFileDto>();
            result = _mapper.Map<PagedResult<GetFileDto>>(allFiles);
            result.Succeed();
            return result;
        }


    }
}
