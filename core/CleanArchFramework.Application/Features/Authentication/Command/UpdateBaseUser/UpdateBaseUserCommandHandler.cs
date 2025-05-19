using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Application.Models.Authentication.Public;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Authentication.Command.UpdateBaseUser
{
    public class UpdateBaseUserCommandHandler : IRequestHandler<UpdateBaseUserCommand, Result<PublicUser>>
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IMapper _mapper;
        public UpdateBaseUserCommandHandler(IAuthenticationService authenticationService, IMapper mapper)
        {
            _authenticationService = authenticationService;
            _mapper = mapper;
        }

        public async Task<Result<PublicUser>> Handle(UpdateBaseUserCommand request, CancellationToken cancellationToken)
        {

            var createBaseUserValidator = new Result<PublicUser>();
            var validator = new UpdateBaseUserValidator();
            var validationResult = await validator.ValidateAsync(request.User, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                createBaseUserValidator.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    createBaseUserValidator.WithError(error.ErrorMessage);
                }
            }
            else
            {
                createBaseUserValidator.Succeed();
                var mapedUser = _mapper.Map<Models.Authentication.UpdateUser>(request.User);
                mapedUser.ProfilePictureFile = request.User.ProfilePictureFile;
                createBaseUserValidator = await _authenticationService.UpdateUserDetailsAsync(request.Id, mapedUser);
               
                return createBaseUserValidator;
            }

            return createBaseUserValidator;
        }
    }
}
