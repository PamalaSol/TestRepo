using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.ProductCategory.Query.GetProductCategory
{
    public sealed class GetProductCategoryQueryHandler : IRequestHandler<GetProductCategoryQuery, Result<GetProductCategoryDto>>
    {
        private readonly IProductCategoryRepository _productCategoryRepository;
        private readonly IMapper _mapper;
        private readonly FileHelper _fileHelper;
        public GetProductCategoryQueryHandler(IMapper mapper, IProductCategoryRepository productCategoryRepository, FileHelper fileHelper)
        {
            _mapper = mapper;
            _productCategoryRepository = productCategoryRepository;
           _fileHelper = fileHelper;

        }

        public async Task<Result<GetProductCategoryDto>> Handle(GetProductCategoryQuery request, CancellationToken cancellationToken)
        {
            var productCategory = await _productCategoryRepository.GetProductCategoryAsync(request.Id);
            var result = new Result<GetProductCategoryDto>();
            result.Data = _mapper.Map<GetProductCategoryDto>(productCategory);
            result.Data.DataImage = await _fileHelper.GetBase64String(productCategory.Image);
            result.Succeed();
            return result;
        }
    }
}
