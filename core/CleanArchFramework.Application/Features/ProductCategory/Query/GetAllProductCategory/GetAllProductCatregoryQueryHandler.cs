using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.ProductCategory.Query.GetAllProductCategory
{
    public sealed class GetAllProductCategoryQueryHandler : IRequestHandler<GetAllProductCategoryQuery, PagedResult<GetAllProductCategoryDto>>
    {
        private readonly IProductCategoryRepository _productCategoryRepository;
        private readonly IMapper _mapper;
        private readonly FileHelper _fileHelper;
        public GetAllProductCategoryQueryHandler(IMapper mapper, IProductCategoryRepository productCategoryRepository, FileHelper fileHelper)
        {
            _mapper = mapper;
            _productCategoryRepository = productCategoryRepository;
            _fileHelper = fileHelper;
        }

        public async Task<PagedResult<GetAllProductCategoryDto>> Handle(GetAllProductCategoryQuery getAllProductCategory, CancellationToken cancellationToken)
        {

            var allCategories = await _productCategoryRepository.GetPagedProductCategoryOrderResponseAsync(
                x => string.IsNullOrEmpty(getAllProductCategory.QueryOptions.SearchTerm) || x.Name.Localizations.Any(x => x.Value == getAllProductCategory.QueryOptions.SearchTerm),
                getAllProductCategory.QueryOptions, x => x.Id,
                x => x.CreatedDate);

            var result = new PagedResult<GetAllProductCategoryDto>();
            foreach (var productCategory in allCategories.Data)
            {
                GetAllProductCategoryDto tempPodcast = _mapper.Map<GetAllProductCategoryDto>(productCategory);
                tempPodcast.DataImage = await _fileHelper.GetBase64String(productCategory.Image);
                result.Data.Add(tempPodcast);
            }
            result.Succeed();
            return result;
        }
    }
}
