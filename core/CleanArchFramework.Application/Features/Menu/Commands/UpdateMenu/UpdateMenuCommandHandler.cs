using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Menu.Commands.UpdateMenu
{
    public class UpdateMenuCommandHandler : IRequestHandler<UpdateMenuCommand, UpdateMenuCommandResponse>
    {
        private readonly IMenuRepository _menuRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public UpdateMenuCommandHandler(IMapper mapper, IMenuRepository menuRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _menuRepository = menuRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<UpdateMenuCommandResponse> Handle(UpdateMenuCommand request, CancellationToken cancellationToken)
        {
            var updateMenuCommandResponse = new UpdateMenuCommandResponse();

            var validator = new UpdateMenuCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                updateMenuCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    updateMenuCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                updateMenuCommandResponse.Succeed();
                var menuToUpdate = await _menuRepository.GetFirstAsync(x => x.Id == request.Id);
                var menu = await _menuRepository.UpdateAsync(_mapper.Map(request, menuToUpdate));
                await _unitOfWork.SaveAsync(cancellationToken);
                updateMenuCommandResponse.Data = _mapper.Map<UpdateMenuDto>(menu);
            }

            return updateMenuCommandResponse;
        }
    }
}
