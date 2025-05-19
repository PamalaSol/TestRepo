using CleanArchFramework.Application.Models.Authentication;
using CleanArchFramework.Application.Models.Authentication.Public;
using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Application.Contracts.Identity
{
    public interface IAuthenticationService
    {

        Task<Result> ActivateUserAsync(string username);
        Task<Result> AddRolesAsync(UserRoleAssignment request);
        // Task<bool> AuthorizeAsync(string userId, string policyName);
        Task<Result> ChangePasswordAsync(string userId, string oldPassword, string newPassword);
        Task<Result> ConfirmUserEmailAsync(string userId, string code);
        Task<Result<PublicUser>> CreateUserAsync(CreateUserBase user, string password, List<string> roles,
            bool isActive = true);
        Task<Result> DeactivateUserAsync(string username);
        Task<Result> DeleteUserAsync(string userId);
        Task<Result> DisableTwoFactorAuthenticationAsync(string userId);
        Task<Result> EnableAuthenticatorAsync(string userId, string verificationCode);
        Task<Result<string>> GenerateEmailConfirmationTokenAsync(string user);
        Task<Result<string>> GeneratePasswordResetTokenAsync(string userEmail, bool checkEmailConfirmed = true);
        Task<Result<IEnumerable<string>>> GenerateTwoFactorRecoveryCodesAsync(string userId, int numberOfCodesToGenerate);
        Task<Result<string>> GetAuthenticatorKeyAsync(string userId);
        Task<Result<(string SharedKey, string AuthenticatorUri)>> GetAuthenticatorSharedKeyAndQrCodeUriAsync(string userId);
        Task<Result<bool>> GetTwoFactorAuthenticationStatusAsync(string userId);
        Task<Result<GetUser>> GetUserByEmailAsync(string email);
        Task<Result<ApplicationUser>> GetApplicationUserByEmailAsync(string email);
        Task<Result<GetUser>> GetUserByIdAsync(string id);
        Task<Result<User>> GetUserByNameAsync(string username);
        Task<string?> GetUserNameAsync(string userId);
        Task<Result<Dictionary<string, string>>> GetUserPersonalDataAsync(string userId);
        Task<bool> IsInRoleAsync(string userId, string role);
        Task<Result> RemoveRolesAsync(UserRoleAssignment request);
        Task<PagedResult<GetUser>> GetAllUsersAsync(QueryOptions options);
        Task<PagedResult<PublicUser>> GetRecentUserAsync(QueryOptions? options = null);
        Task<Result> ResetAuthenticatorAsync(string userId);
        Task<Result> ResetPasswordAsync(string id, string token, string password);
        Task<Result> UpdateRolesAsync(string username, List<string> roles);
        Task<Result<PublicUser>> UpdateUserDetailsAsync(string userId, UpdateUser request);

    }
}
