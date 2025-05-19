using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Category.Query.GetAllCategory
{
    public sealed class GetAllCategoryQueryHandler : IRequestHandler<GetAllCategoryQuery, PagedResult<GetAllCategoryDto>>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly FileHelper _fileHelper;
        public GetAllCategoryQueryHandler(IMapper mapper,ICategoryRepository categoryRepository, FileHelper fileHelper)
        {
            _mapper = mapper;
            _categoryRepository = categoryRepository;
            _fileHelper = fileHelper;
        }

        public async Task<PagedResult<GetAllCategoryDto>> Handle(GetAllCategoryQuery getAllCategory, CancellationToken cancellationToken)
        {

            var allCategories = await _categoryRepository.GetPagedCategoryOrderResponseAsync(
                x => string.IsNullOrEmpty(getAllCategory.QueryOptions.SearchTerm) || x.Name.Localizations.Any(x=>x.Value == getAllCategory.QueryOptions.SearchTerm),
                getAllCategory.QueryOptions, x => x.Id,
                x => x.CreatedDate);

            var result = new PagedResult<GetAllCategoryDto>();
            foreach (var category in allCategories.Data)
            {
                GetAllCategoryDto tempPodcast = _mapper.Map<GetAllCategoryDto>(category);
                tempPodcast.DataImage = await _fileHelper.GetBase64String(category.Image);
                result.Data.Add(tempPodcast);
            }
            result.Succeed();
            return result;
        }
    }
}
