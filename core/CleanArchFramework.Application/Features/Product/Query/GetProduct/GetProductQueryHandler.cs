using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Product.Query.GetProduct
{
    public sealed class GetProductQueryHandler : IRequestHandler<GetProductQuery, Result<GetProductDto>>
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private readonly ILocalizationService _localizationService;

        public GetProductQueryHandler(IMapper mapper, IProductRepository productRepository, ILocalizationService localizationService, IFileService fileService)
        {
            _mapper = mapper;
            _productRepository = productRepository;
            _localizationService = localizationService;
        }

        public async Task<Result<GetProductDto>> Handle(GetProductQuery request, CancellationToken cancellationToken)
        {
            var localization = _localizationService.GetCurrentLanguageId();
            var product = await _productRepository.GetFirstProductNoTrackingAsync(x =>
                x.Id == request.Id, localization);
            var result = new Result<GetProductDto>();
            result.Data = _mapper.Map<GetProductDto>(product);

            result.Succeed();
            return result;
        }
    }
}
