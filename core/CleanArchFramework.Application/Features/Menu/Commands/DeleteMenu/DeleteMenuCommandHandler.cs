using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Menu.Commands.DeleteMenu
{
    public class DeleteMenuCommandHandler : IRequestHandler<DeleteMenuCommand, DeleteMenuCommandResponse>
    {
        private readonly IMenuRepository _menuRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public DeleteMenuCommandHandler(IMapper mapper, IMenuRepository menuRepository, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _menuRepository = menuRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeleteMenuCommandResponse> Handle(DeleteMenuCommand request, CancellationToken cancellationToken)
        {
            var deleteMenuCommandResponse = new DeleteMenuCommandResponse();

            var validator = new DeleteMenuCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                deleteMenuCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    deleteMenuCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                deleteMenuCommandResponse.Succeed();
            }
            if (deleteMenuCommandResponse.IsSuccessful)
            {
                var menu = await _menuRepository.GetFirstAsync(request.Id);
                menu = await _menuRepository.DeleteAsync(menu);
                await _unitOfWork.SaveAsync(cancellationToken);
                deleteMenuCommandResponse.Data = _mapper.Map<DeleteMenuDto>(menu);
            }

            return deleteMenuCommandResponse;
        }
    }
}
