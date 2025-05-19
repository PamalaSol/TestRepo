using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Menu.Query.GetAllMenus
{
    public sealed class GetAllMenuQueryHandler : IRequestHandler<GetAllMenuQuery, PagedResult<GetAllMenuDto>>
    {
        private readonly IMenuRepository _menuRepository;
        private readonly IMapper _mapper;

        public GetAllMenuQueryHandler(IMapper mapper, IMenuRepository menuRepository)
        {
            _mapper = mapper;
            _menuRepository = menuRepository;
        }

        public async Task<PagedResult<GetAllMenuDto>> Handle(GetAllMenuQuery getAllMenu, CancellationToken cancellationToken)
        {

            var allMenus = await _menuRepository.GetPagedAndOrderResponseAsync(
                x => string.IsNullOrEmpty(getAllMenu.QueryOptions.SearchTerm) || x.Name.Contains(getAllMenu.QueryOptions.SearchTerm),
                getAllMenu.QueryOptions, x => x.Id,
                x => x.CreatedDate);

            var result = _mapper.Map<PagedResult<GetAllMenuDto>>(allMenus);
            result.Succeed();
            return result;
        }
    }
}
