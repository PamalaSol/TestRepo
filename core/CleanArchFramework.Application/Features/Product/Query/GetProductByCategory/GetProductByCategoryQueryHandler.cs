using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Features.Product.Query.GetProduct;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Product.Query.GetProductByCategory
{
    public sealed class GetProductByCategoryQueryHandler : IRequestHandler<GetProductByCategoryQuery, Result<GetProductDto>>
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private readonly ILocalizationService _localizationService;

        public GetProductByCategoryQueryHandler(IMapper mapper, IProductRepository productRepository, ILocalizationService localizationService)
        {
            _mapper = mapper;
            _productRepository = productRepository;
            _localizationService = localizationService;
        }

        public async Task<Result<GetProductDto>> Handle(GetProductByCategoryQuery request, CancellationToken cancellationToken)
        {
            var localization = _localizationService.GetCurrentLanguageId();
            var product = await _productRepository.GetFirstProductNoTrackingAsync(x =>
                x.Id == request.Id
                && x.ProductCategories.Any(x => x.Id == request.CategoryId)
                , localization);
            var result = new Result<GetProductDto>();
            result.Data = _mapper.Map<GetProductDto>(product);
            result.Succeed();
            return result;
        }
    }
}
