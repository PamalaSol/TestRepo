using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Application.Features.Authentication.Command.ChangePassword;
using CleanArchFramework.Application.Features.Authentication.Command.GenerateEmailConfirmationToken;
using CleanArchFramework.Application.Features.Authentication.Command.GenerateResetPasswordToken;
using CleanArchFramework.Application.Features.Authentication.Command.UpdateUser;
using CleanArchFramework.Application.Models.Authentication;
using CleanArchFramework.Application.Models.Authentication.Public;
using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Web;
using CleanArchFramework.Application.Features.Authentication.Command.UpdateBaseUser;
using User = CleanArchFramework.Application.Models.Authentication.User;

namespace CleanArchFramework.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserAuthenticationService _userAuthenticationService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IMediator _mediator;
        public AccountController(IUserAuthenticationService userAuthenticationService, IAuthenticationService authenticationService, IMediator mediator)
        {
            _authenticationService = authenticationService;
            _mediator = mediator;
            _userAuthenticationService = userAuthenticationService;
        }

        /// <summary>
        /// Login
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("authenticate")]
        public async Task<ActionResult<Result<AuthenticationResponse>>> AuthenticateAsync(AuthenticationRequest request)
        {
    
            return Ok(await _userAuthenticationService.Login(request));
        }
        /// <summary>
        /// Logout
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("logout")]
        public async Task<ActionResult<Result>> Logout(AuthenticationRequest request)
        {
            return Ok(await _userAuthenticationService.Logout());
        }
        /// <summary>
        /// Register user with auto generated password.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPost("create")]
        public async Task<ActionResult<Result<PublicUser>>> RegisterWithoutPassword([FromForm] CreateUserBase user)
        {
            return Ok(await _mediator.Send(user));
        }

        /// <summary>
        /// Register user with password.
        /// </summary>
        /// <returns></returns>
        [HttpPost("register")]
        public async Task<ActionResult<Result<PublicUser>>> RegisterUser([FromForm] CreateUserWithPassword user)
        {
            return Ok(await _mediator.Send(user));
        }
        /// <summary>
        /// Register user with roles.
        /// </summary>
        [HttpPost("admin/create")]
        [Authorize("Superadmin")]
        public async Task<ActionResult<Result<PublicUser>>> RegisterUser([FromForm] CreateUser user)
        {
            return Ok(await _mediator.Send(user));
        }
        /// <summary>
        /// Updates user.
        /// </summary>
        [HttpPut("update/{id}")]
        [Authorize("Superadmin")]
        public async Task<ActionResult<Result<PublicUser>>> UpdateUserDetailsAsync(string id, [FromForm] UpdateUser user)
        {
            return Ok(await _mediator.Send(new UpdateUserCommand { Id = id, User = user }));
        }
        /// <summary>
        /// Updates Alumni.
        /// </summary>
        [HttpPut("updateuser/{id}")]
        public async Task<ActionResult<Result<PublicUser>>> UpdateUserDetailsAsync(string id, [FromForm] UpdateUserBase user)
        {
            return Ok(await _mediator.Send(new UpdateBaseUserCommand { Id = id, User = user }));
        }
        /// <summary>
        /// Change password using old password.
        /// </summary>
        [HttpPut("changePassword/{userId}")]
        public async Task<ActionResult<Result>> ChangePasswordAsync(string userId, UpdatePassword user)
        {
            return Ok(await _mediator.Send(new ChangePasswordCommand { UserId = userId, ConfirmPassword = user.ConfirmPassword, OldPassword = user.OldPassword, Password = user.Password }));

        }

        [HttpGet("getByEmail/{email}")]
        [Authorize("Admin")]
        public async Task<ActionResult<Result>> GetUserByEmail(string email)
        {
            return Ok(await _authenticationService.GetUserByEmailAsync(email));
        }
        [HttpGet("get/{id}")]
        [Authorize(Roles = "Superadmin")]
        public async Task<ActionResult<Result<PublicUser>>> GetUserId(string id)
        {
            var result = await _authenticationService.GetUserByIdAsync(id);
            return result.IsSuccessful ? Ok(new Result<PublicUser>().Succeed().Data = result.Data) : Ok(result);
        }

        [HttpGet("getAll")]
        [Authorize(Roles = "Superadmin")]
        public async Task<ActionResult<PagedResult<User>>> GetAllUsers([FromQuery] QueryOptions options)
        {
            return Ok(await _authenticationService.GetAllUsersAsync(options));
        }
        /// <summary>
        /// Returns recent Users!.
        /// </summary>
        [HttpGet("RecentUsers")]
        public async Task<ActionResult<PagedResult<PublicUser>>> GetRecentUser([FromQuery] QueryOptions options)
        {
            return Ok(await _authenticationService.GetRecentUserAsync(options));
        }

        /// <summary>
        /// Confirms user with token!
        /// </summary>
        [HttpPost("confirmEmail/{userId}/{token}")]
        public async Task<ActionResult<Result>> ConfirmUserEmail(string userId, string token)
        {
            return Ok(await _authenticationService.ConfirmUserEmailAsync(userId, token));
        }
        /// <summary>
        /// Resets password with token!
        /// </summary>
        [HttpPost("resetPassword/{userId}/{token}")]
        public async Task<ActionResult<Result>> ResetPassword(string userId, string token, [FromBody] ResetPassword resetPassword)
        {
            if (resetPassword.ConfirmPassword.Equals(resetPassword.Password))
            {
                var decodedToken = HttpUtility.UrlDecode(token);
                return Ok(await _authenticationService.ResetPasswordAsync(userId, decodedToken, resetPassword.Password));
            }
            else
            {
                return BadRequest(new Result().Fail().WithMessage("Password and reset password do not match!"));
            }
        }


        ///// <summary>
        ///// Only for testing purposes. Do not use in production!
        ///// </summary>
        //[HttpPost("generatePasswordReset/{id}")]
        //public async Task<ActionResult<Result>> GeneratePasswordResetToken(string id)
        //{
        //    return Ok(await _authenticationService.GeneratePasswordResetTokenAsync(id));
        //}

        /// <summary>
        /// Generates password reset token and sends it on Email!
        /// </summary>
        [HttpPost("generatePasswordReset/{email}")]
        public async Task<ActionResult<Result>> GeneratePasswordResetToken(string email)
        {
            return Ok(await _mediator.Send(new GenerateResetPasswordTokenCommand { Email = email }));
        }

        ///// <summary>
        ///// Only for testing purposes. Do not use in production!
        ///// </summary>
        ///// <param name="email"></param>
        ///// <returns></returns>
        //[HttpPost("generateEmailToken")]
        //public async Task<ActionResult<Result>> GenerateEmailConfirmationToken(string email)
        //{
        //    return Ok(await _authenticationService.GenerateEmailConfirmationTokenAsync(email));
        //}

        /// <summary>
        /// Generates email reset token and sends it on Email!
        /// </summary>
        [HttpPost("generateEmailToken/{Email}")]
        public async Task<ActionResult<Result>> GenerateEmailConfirmationToken(string email)
        {
            return Ok(await _mediator.Send(new GenerateEmailConfirmationTokenCommand { Email = email }));
        }

        /// <summary>
        /// Deletes User
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpDelete("Delete")]
        [Authorize(Roles = "Superadmin")]
        public async Task<ActionResult<Result>> DeleteUser(string userId)
        {
            return Ok(await _authenticationService.DeleteUserAsync(userId));
        }
    }
}
