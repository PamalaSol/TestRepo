using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.FileCategory.Query.GetAllFileCategory
{
    public sealed class GetAllProductCategoryQueryHandler : IRequestHandler<GetAllFileCategoryQuery, PagedResult<GetAllFileCategoryDto>>
    {
        private readonly IFileCategoryRepository _fileCategory;
        private readonly IMapper _mapper;
        private readonly FileHelper _fileHelper;
        public GetAllProductCategoryQueryHandler(IMapper mapper, IFileCategoryRepository productCategoryRepository, FileHelper fileHelper)
        {
            _mapper = mapper;
            _fileCategory = productCategoryRepository;
            _fileHelper = fileHelper;
        }

        public async Task<PagedResult<GetAllFileCategoryDto>> Handle(GetAllFileCategoryQuery getAllProductCategory, CancellationToken cancellationToken)
        {

            var allCategories = await _fileCategory.GetPagedAndOrderResponseAsync(
                x => string.IsNullOrEmpty(getAllProductCategory.QueryOptions.SearchTerm) || x.Name.Localizations.Any(x => x.Value == getAllProductCategory.QueryOptions.SearchTerm),
                getAllProductCategory.QueryOptions, x => x.Id,
                x => x.CreatedDate);

            var result = new PagedResult<GetAllFileCategoryDto>();
            foreach (var productCategory in allCategories.Data)
            {
                GetAllFileCategoryDto tempPodcast = _mapper.Map<GetAllFileCategoryDto>(productCategory);
                tempPodcast.DataImage = await _fileHelper.GetBase64String(productCategory.Image);
                result.Data.Add(tempPodcast);
            }
            result.Succeed();
            return result;
        }
    }
}
