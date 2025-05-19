using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Application.Exceptions;
using CleanArchFramework.Application.Models.Authentication;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using CleanArchFramework.Application.Shared;
using CleanArchFramework.Domain.Entities;


namespace CleanArchFramework.Infrastructure.Identity.Services
{
    public class UserAuthenticationService : IUserAuthenticationService
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IMapper _mapper;
        private readonly ILogger<IUserAuthenticationService> _logger;
        private readonly IJwtProvider _jwtProvider;
        private readonly IAuthenticationService _authenticationService;

        public UserAuthenticationService(SignInManager<ApplicationUser> signInManager, IMapper mapper, ILogger<UserAuthenticationService> logger, IJwtProvider jwtProvider, IAuthenticationService authenticationService)
        {
            _signInManager = signInManager;
            _mapper = mapper;
            _logger = logger;
            _jwtProvider = jwtProvider;
            _authenticationService = authenticationService;
        }
        public async Task<Result<AuthenticationResponse>> Login(AuthenticationRequest loginRequest)
        {
            var serviceResult = new Result<AuthenticationResponse>();
            try
            {
                var applicationUser = await _authenticationService.GetUserByEmailAsync(loginRequest?.Email);
                var validationResult = ValidateUserForLogin(applicationUser.Data);
                if (validationResult.IsFailed)
                    return serviceResult.Fail();
                return await SignInUser(applicationUser.Data, loginRequest);
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to sign in user.");
            }
            return serviceResult;
        }

        public async Task<Result<AuthenticationResponse>> LoginWith2Fa(Authentication2FaRequest login2FARequest)
        {
            var serviceResult = new Result<AuthenticationResponse>();
            try
            {
                var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
                var mUser = _mapper.Map<GetUser>(user);
                var validationResult = ValidateUserForLogin(mUser);
                if (validationResult.IsFailed)
                    return serviceResult.Fail();

                return await SignInUser2fa(mUser, login2FARequest);
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to sign in user with 2FA.");
            }
            return serviceResult;
        }

        public async Task<Result<AuthenticationResponse>> LoginWithRecoveryCode(Authentication2FaRequest login2FARequest)
        {
            var serviceResult = new Result<AuthenticationResponse>();
            try
            {
                var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
                GetUser? mUser = null;
                if (user != null)
                {
                     mUser = _mapper.Map<GetUser>(user);
                }
                else
                {
                    throw new BadRequestException("Invalid user!");
                }

                var validationResult = ValidateUserForLogin(mUser);
                if (validationResult.IsFailed)
                    return serviceResult.Fail();

                return await SignInUserRecoveryCode(mUser, login2FARequest);
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to sign in user with recovery code.");
            }
            return serviceResult;
        }

        public async Task<Result> Logout()
        {
            var serviceResult = new Result<string>();
            try
            {
                await _signInManager.SignOutAsync();
                serviceResult.Succeed().WithMessage("Successfully logged out.");
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to sign out user.");
            }
            return serviceResult;
        }

        public async Task<Result<User>> GetTwoFactorAuthenticationUserAsync()
        {
            var serviceResult = new Result<User>();
            try
            {
                var appUser = await _signInManager.GetTwoFactorAuthenticationUserAsync();
                if (appUser == null)
                {
                    return serviceResult.Fail().WithError("Unable to retrieve two-factor authentication user");
                }
                return serviceResult.Succeed().WithData(_mapper.Map<User>(appUser));
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to retrieve two factor authentication user.");
            }
            return serviceResult;
        }

        private static Result<string> ValidateUserForLogin(GetUser? applicationUser)
        {
            var serviceResult = new Result<string>();
            if (applicationUser == null)
                return serviceResult.Fail().WithMessage("User not found.");

            if (applicationUser.IsActive == false)
                return serviceResult.Fail().WithMessage("User is not active.");
            return serviceResult;
        }

        private async Task<Result<AuthenticationResponse>> SignInUser(GetUser applicationUser, AuthenticationRequest loginRequest)
        {
            var serviceResult = new Result<AuthenticationResponse>();
            var applicationUserU = await _authenticationService.GetApplicationUserByEmailAsync(loginRequest?.Email);
         
            var loginResult = await _signInManager.CheckPasswordSignInAsync(applicationUserU.Data, loginRequest.Password, false);
            if (!loginResult.Succeeded)
            {
                return serviceResult.Fail().WithError("Authentication failed");
            }
            serviceResult.Succeed().WithData(await ConstructAuthenticationResponse(applicationUser, loginResult));
            return serviceResult;
        }

        private async Task<Result<AuthenticationResponse>> SignInUser2fa(GetUser applicationUser, Authentication2FaRequest login2faRequest)
        {
            var serviceResult = new Result<AuthenticationResponse>();
            var loginResult = await _signInManager.TwoFactorAuthenticatorSignInAsync(login2faRequest.Code, login2faRequest.IsPersisted, login2faRequest.RememberClient);

            serviceResult.Succeed().WithData(await ConstructAuthenticationResponse(applicationUser, loginResult));
            return serviceResult;
        }

        private async Task<Result<AuthenticationResponse>> SignInUserRecoveryCode(GetUser applicationUser, Authentication2FaRequest login2faRequest)
        {
            var serviceResult = new Result<AuthenticationResponse>();
            var loginResult = await _signInManager.TwoFactorRecoveryCodeSignInAsync(login2faRequest.Code);
           // var roles = await _userManager.GetRolesAsync(applicationUser);
            serviceResult.Succeed().WithData(await ConstructAuthenticationResponse(applicationUser, loginResult, applicationUser.Roles.ToList()));
            return serviceResult;
        }

        private async Task<AuthenticationResponse> ConstructAuthenticationResponse(GetUser user, SignInResult signInResult, List<string>? roles = null)
        {
            var response = new AuthenticationResponse()
            {
                User = new User
                {
                    Name = user.Name,
                    LastName = user.LastName,
                  //  UserName = user.UserName,
                    Email = user.Email,
                    Id = user.Id,
                    Roles = user.Roles,
                 
                },
                Success = signInResult.Succeeded,
                IsLockedOut = signInResult.IsLockedOut,
                Requires2Fa = signInResult.RequiresTwoFactor,
                IsNotAllowed = signInResult.IsNotAllowed,
                AccessToken = await _jwtProvider.CreateJwtAsync(user.Id)
            };
            return response;
        }
    }
}
