using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchFramework.Application.Features.Product.Query.GetProductsByCategory
{
    public sealed class GetProductsByCategoryQueryHandler : IRequestHandler<GetProductsByCategoryQuery, PagedResult<GetProductsByCategoryDto>>
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        private readonly ILocalizationService _localizationService;

        public GetProductsByCategoryQueryHandler(IMapper mapper, IProductRepository productRepository, ILocalizationService localizationService)
        {
            _mapper = mapper;
            _productRepository = productRepository;
            _localizationService = localizationService;
        }

        public async Task<PagedResult<GetProductsByCategoryDto>> Handle(GetProductsByCategoryQuery getProductsByCategory, CancellationToken cancellationToken)
        {
            PagedResult<Domain.Entities.Product> productsByCategory = null;
            var language = _localizationService.GetCurrentLanguageId();


            productsByCategory = await _productRepository.GetPagedProductAndOrderResponseAsync(
          x =>
              (getProductsByCategory.ProductCategory == null || x.ProductCategories.Any(pc => pc.Id == getProductsByCategory.ProductCategory)) &&
              (
                  (string.IsNullOrEmpty(getProductsByCategory.HousingMaterial) || x.Housing.Localizations.Any(l => l.LanguageId == language && l.Value.ToLower().Contains(getProductsByCategory.HousingMaterial.ToLower()))) && (
                  (string.IsNullOrEmpty(getProductsByCategory.Connection) || x.ConnectionType.Localizations.Any(l => l.LanguageId == language && l.Value.ToLower().Contains(getProductsByCategory.Connection.ToLower()))) ||
                  (string.IsNullOrEmpty(getProductsByCategory.Connection) || x.Screws.Localizations.Any(l => l.LanguageId == language && l.Value.ToLower().Contains(getProductsByCategory.Connection.ToLower()))) ||
                  (string.IsNullOrEmpty(getProductsByCategory.Connection) || x.SuitableFor.Localizations.Any(l => l.LanguageId == language && l.Value.ToLower().Contains(getProductsByCategory.Connection.ToLower()))))
              ) &&
              (
                  string.IsNullOrEmpty(getProductsByCategory.QueryOptions.SearchTerm) ||
                  x.Heading.Localizations.Any(l => l.LanguageId == language && l.Value.ToLower().Contains(getProductsByCategory.QueryOptions.SearchTerm.ToLower())) ||
                  x.Series.ToLower().Contains(getProductsByCategory.QueryOptions.SearchTerm.ToLower()) ||
                  x.Dimensions.ToLower().Contains(getProductsByCategory.QueryOptions.SearchTerm.ToLower()) ||
                  x.Housing.Localizations.Any(l => l.LanguageId == language && l.Value.ToLower().Contains(getProductsByCategory.QueryOptions.SearchTerm.ToLower())) ||
                  x.Quality.ToLower().Contains(getProductsByCategory.QueryOptions.SearchTerm.ToLower()) ||
                  x.Images.Files.Any(z => z.LanguageId == language && EF.Functions.Like(z.Alt.ToLower(), $"%{getProductsByCategory.QueryOptions.SearchTerm.ToLower()}%"))

              ),
          getProductsByCategory.QueryOptions, x => x.CreatedDate,
          x => x.CreatedDate, language);

            var result = _mapper.Map<PagedResult<GetProductsByCategoryDto>>(productsByCategory);
            result.Succeed();
            return result;
        }
    }
}
