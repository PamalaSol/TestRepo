using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CleanArchFramework.Application.Features.Product.Query.GetAllProduct
{
    public sealed class GetAllProductQueryHandler : IRequestHandler<GetAllProductQuery, PagedResult<GetAllProductDto>>
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private readonly IFileService _fileService;
        private readonly ILocalizationService _localizationService;

        public GetAllProductQueryHandler(IMapper mapper, IProductRepository productRepository, IFileService fileService, ILocalizationService localizationService)
        {
            _mapper = mapper;
            _productRepository = productRepository;
            _fileService = fileService;
            _localizationService = localizationService;
        }

        public async Task<PagedResult<GetAllProductDto>> Handle(GetAllProductQuery getAllProduct, CancellationToken cancellationToken)
        {
            PagedResult<Domain.Entities.Product> allProduct = null;
            var language = _localizationService.GetCurrentLanguageId();

            allProduct = await _productRepository.GetPagedProductAndOrderResponseAsync(
             x =>
             (
                 (
                     string.IsNullOrEmpty(getAllProduct.HousingMaterial) ||
                     x.Housing.Localizations.Any(l => l.LanguageId == language && EF.Functions.Like(l.Value.ToLower(), $"%{getAllProduct.HousingMaterial.ToLower()}%"))
                 ) &&
                 (
                     string.IsNullOrEmpty(getAllProduct.Connection) ||
                     x.ConnectionType.Localizations.Any(l => l.LanguageId == language && EF.Functions.Like(l.Value.ToLower(), $"%{getAllProduct.Connection.ToLower()}%")) ||
                     x.Screws.Localizations.Any(l => l.LanguageId == language && EF.Functions.Like(l.Value.ToLower(), $"%{getAllProduct.Connection.ToLower()}%")) ||
                     x.SuitableFor.Localizations.Any(l => l.LanguageId == language && EF.Functions.Like(l.Value.ToLower(), $"%{getAllProduct.Connection.ToLower()}%"))
                 )
             ) &&
             (
                 string.IsNullOrEmpty(getAllProduct.QueryOptions.SearchTerm) ||
                 x.Heading.Localizations.Any(l => l.LanguageId == language && EF.Functions.Like(l.Value.ToLower(), $"%{getAllProduct.QueryOptions.SearchTerm.ToLower()}%")) ||
                 EF.Functions.Like(x.Series.ToLower(), $"%{getAllProduct.QueryOptions.SearchTerm.ToLower()}%") ||
                 EF.Functions.Like(x.Dimensions.ToLower(), $"%{getAllProduct.QueryOptions.SearchTerm.ToLower()}%") ||
                 x.Housing.Localizations.Any(l => l.LanguageId == language && EF.Functions.Like(l.Value.ToLower(), $"%{getAllProduct.QueryOptions.SearchTerm.ToLower()}%")) ||
                 EF.Functions.Like(x.Quality.ToLower(), $"%{getAllProduct.QueryOptions.SearchTerm.ToLower()}%") ||
                 x.Images.Files.Any(z => z.LanguageId == language && EF.Functions.Like(z.Alt.ToLower(), $"%{getAllProduct.QueryOptions.SearchTerm.ToLower()}%"))

             ),
             getAllProduct.QueryOptions, x => x.CreatedDate,
             x => x.CreatedDate, language);
            #region 
            //If nothing is found for the whole word search by word by word.
            //var searchTerm = getAllProduct.QueryOptions.SearchTerm?.ToLower();
            //var searchWords = string.IsNullOrEmpty(searchTerm)
            //    ? new List<string>()
            //    : searchTerm.Split(new[] { ' ', '-' }, StringSplitOptions.RemoveEmptyEntries).ToList();

            //var param1 = searchWords.Count > 0 ? searchWords[0] : null;
            //var param2 = searchWords.Count > 1 ? searchWords[1] : null;
            //var param3 = searchWords.Count > 2 ? searchWords[2] : null;

            //    if (searchWords.Count > 1 && allProduct.Data.Count  <= 0)
            //    {
            //        allProduct = await _productRepository.GetPagedProductAndOrderResponseAsync(
            //   x =>
            //   (
            //       (
            //           string.IsNullOrEmpty(getAllProduct.HousingMaterial) ||
            //           x.Housing.Localizations.Any(l => l.LanguageId == language && EF.Functions.Like(l.Value.ToLower(), $"%{getAllProduct.HousingMaterial.ToLower()}%"))
            //       ) &&
            //       (
            //           string.IsNullOrEmpty(getAllProduct.Connection) ||
            //           x.ConnectionType.Localizations.Any(l => l.LanguageId == language && EF.Functions.Like(l.Value.ToLower(), $"%{getAllProduct.Connection.ToLower()}%")) ||
            //           x.Screws.Localizations.Any(l => l.LanguageId == language && EF.Functions.Like(l.Value.ToLower(), $"%{getAllProduct.Connection.ToLower()}%")) ||
            //           x.SuitableFor.Localizations.Any(l => l.LanguageId == language && EF.Functions.Like(l.Value.ToLower(), $"%{getAllProduct.Connection.ToLower()}%"))
            //       )
            //   ) &&
            //   (
            //       string.IsNullOrEmpty(getAllProduct.QueryOptions.SearchTerm) ||
            //       x.Heading.Localizations.Any(l => l.LanguageId == language && EF.Functions.Like(l.Value.ToLower(), $"%{getAllProduct.QueryOptions.SearchTerm.ToLower()}%")) ||
            //       EF.Functions.Like(x.Series.ToLower(), $"%{getAllProduct.QueryOptions.SearchTerm.ToLower()}%") ||
            //       EF.Functions.Like(x.Dimensions.ToLower(), $"%{getAllProduct.QueryOptions.SearchTerm.ToLower()}%") ||
            //       x.Housing.Localizations.Any(l => l.LanguageId == language && EF.Functions.Like(l.Value.ToLower(), $"%{getAllProduct.QueryOptions.SearchTerm.ToLower()}%")) ||
            //       EF.Functions.Like(x.Quality.ToLower(), $"%{getAllProduct.QueryOptions.SearchTerm.ToLower()}%") 
            //   )
            //   ||
            //   (
            //              string.IsNullOrEmpty(param1) ||
            //       x.Heading.Localizations.Any(l => l.LanguageId == language && (l.Value.ToLower().Contains(param1) || l.Value.ToLower().Contains(param2) || l.Value.ToLower().Contains(param3)) ||

            //         EF.Functions.Like(x.Series.ToLower(),  $"%{param1}%") || EF.Functions.Like(x.Series.ToLower(), $"%{param2}%") || EF.Functions.Like(x.Series.ToLower(), $"%{param3}%") ||
            //       EF.Functions.Like(x.Dimensions.ToLower(), $"%{param1}%") || EF.Functions.Like(x.Dimensions.ToLower(), $"%{param2}%") || EF.Functions.Like(x.Dimensions.ToLower(), $"%{param3}%") ||
            //       string.IsNullOrEmpty(param1) ||
            //       x.Housing.Localizations.Any(l => l.LanguageId == language && (l.Value.ToLower().Contains(param1) ||
            //       l.Value.ToLower().Contains(param2) || l.Value.ToLower().Contains(param3))) || 
            //       EF.Functions.Like(x.Quality.ToLower(), $"%{param1}%") || EF.Functions.Like(x.Quality.ToLower(), $"%{param2}%") || EF.Functions.Like(x.Quality.ToLower(), $"%{param3}%")

            //)

            //)
            //,
            //getAllProduct.QueryOptions, x => x.CreatedDate,
            //x => x.CreatedDate, language);
            // }
            #endregion
            var result = _mapper.Map<PagedResult<GetAllProductDto>>(allProduct);
            result.Succeed();
            return result;
        }
    }
}
