using CleanArchFramework.Application.Models.Authentication;
using CleanArchFramework.Application.Shared.Result;

namespace CleanArchFramework.Application.Contracts.Identity
{
    public interface IUserAuthenticationService
    {
        Task<Result<User>> GetTwoFactorAuthenticationUserAsync();
        Task<Result<AuthenticationResponse>> Login(AuthenticationRequest loginRequest);
        Task<Result<AuthenticationResponse>> LoginWith2Fa(Authentication2FaRequest login2FaRequest);
        Task<Result<AuthenticationResponse>> LoginWithRecoveryCode(Authentication2FaRequest login2FaRequest);
        Task<Result> Logout();
    }
}
