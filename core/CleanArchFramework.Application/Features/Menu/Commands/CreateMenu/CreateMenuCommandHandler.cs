using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Menu.Commands.CreateMenu
{
    public class CreateMenuCommandHandler : IRequestHandler<CreateMenuCommand, CreateMenuCommandResponse>
    {
        private readonly IMenuRepository _menuRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public CreateMenuCommandHandler(IMapper mapper, IMenuRepository menuRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _menuRepository = menuRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<CreateMenuCommandResponse> Handle(CreateMenuCommand request, CancellationToken cancellationToken)
        {
            var createCategoryCommandResponse = new CreateMenuCommandResponse();

            var validator = new CreateMenuCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                createCategoryCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    createCategoryCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                createCategoryCommandResponse.Succeed();
            }
            if (createCategoryCommandResponse.IsSuccessful)
            {
                var menu = new Domain.Entities.Menu() { Name = request.Name };
                menu = await _menuRepository.AddAsync(menu);
                await _unitOfWork.SaveAsync(cancellationToken);
                createCategoryCommandResponse.Data = _mapper.Map<CreateMenuDto>(menu);
            }

            return createCategoryCommandResponse;
        }
    }
}
