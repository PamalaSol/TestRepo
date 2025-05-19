using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Menu.Query.GetMenu
{
    public sealed class GetMenuQueryHandler : IRequestHandler<GetMenuQuery, Result<GetMenuDto>>
    {
        private readonly IMenuRepository _menuRepository;
        private readonly IMapper _mapper;

        public GetMenuQueryHandler(IMapper mapper, IMenuRepository menuRepository)
        {
            _mapper = mapper;
            _menuRepository = menuRepository;
        }

        public async Task<Result<GetMenuDto>> Handle(GetMenuQuery request, CancellationToken cancellationToken)
        {
            var allCategories = await _menuRepository.GetFirstAsync(x => x.Id == request.Id);
            var result = new Result<GetMenuDto>();
            result.Data = _mapper.Map<GetMenuDto>(allCategories);
            result.Succeed();
            return result;
        }
    }
}
