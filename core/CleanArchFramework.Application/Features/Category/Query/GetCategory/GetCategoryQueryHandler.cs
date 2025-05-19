using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Category.Query.GetCategory
{
    public sealed class GetCategoryQueryHandler : IRequestHandler<GetCategoryQuery, Result<GetCategoryDto>>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly FileHelper _fileHelper;
        public GetCategoryQueryHandler(IMapper mapper, ICategoryRepository categoryRepository, FileHelper fileHelper)
        {
            _mapper = mapper;
            _categoryRepository = categoryRepository;
            _fileHelper = fileHelper;
          
        }

        public async Task<Result<GetCategoryDto>> Handle(GetCategoryQuery request, CancellationToken cancellationToken)
        {
            var category = await _categoryRepository.GetCategoryAsync(request.Id);
            var result = new Result<GetCategoryDto>();
            result.Data = _mapper.Map<GetCategoryDto>(category);
            result.Data.DataImage = await _fileHelper.GetBase64String(category.Image);
            result.Succeed();
            return result;
        }
    }
}
