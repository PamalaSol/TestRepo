using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Application.Models.Authentication.Public;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Authentication.Command.UpdateUser
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Result<PublicUser>>
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IMapper _mapper;
        public UpdateUserCommandHandler(IAuthenticationService authenticationService, IMapper mapper)
        {
            _authenticationService = authenticationService;
            _mapper = mapper;
        }

        public async Task<Result<PublicUser>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {

            var createUserValidator = new Result<PublicUser>();
            var validator = new UpdateUserValidator();
            var validationResult = await validator.ValidateAsync(request.User, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                createUserValidator.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    createUserValidator.WithError(error.ErrorMessage);
                }
            }
            else
            {
                createUserValidator.Succeed();
                createUserValidator = await _authenticationService.UpdateUserDetailsAsync(request.Id, request.User);

                return createUserValidator;
            }

            return createUserValidator;
        }

    }
}
