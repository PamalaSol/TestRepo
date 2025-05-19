using Microsoft.AspNetCore.Identity;
using System.Globalization;
using System.Text;
using System.Text.Encodings.Web;
using System.Transactions;
using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Models.Authentication;
using CleanArchFramework.Application.Models.Authentication.Public;
using CleanArchFramework.Application.Shared;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Aggregates;
using CleanArchFramework.Domain.Entities;
using CleanArchFramework.Domain.Enum;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using User = CleanArchFramework.Application.Models.Authentication.User;

namespace CleanArchFramework.Infrastructure.Identity.Services
{
    public class AuthenticationService : IAuthenticationService
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ILogger<AuthenticationService> _logger;
        private readonly UrlEncoder _urlEncoder;
        private const string AUTHENTICATOR_URI_FORMAT = "otpauth://totp/{0}:{1}?secret={2}&issuer={0}&digits=6";
        private readonly IFileService _fileService;
        private readonly FileHelper _fileHelper;

        public AuthenticationService(
            UserManager<ApplicationUser> userManager,
            IMapper mapper,
            ILogger<AuthenticationService> logger,
            UrlEncoder urlEncoder, IFileService fileService, FileHelper fileHelper)
        {
            _userManager = userManager;
            _mapper = mapper;
            _logger = logger;
            _urlEncoder = urlEncoder;
            _fileService = fileService;
            _fileHelper = fileHelper;
        }
        public async Task<string?> GetUserNameAsync(string userId)
        {
            var user = await _userManager.Users.FirstAsync(u => u.Id == userId);

            return user.UserName;
        }

        public async Task<bool> IsInRoleAsync(string userId, string role)
        {
            var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

            return user != null && await _userManager.IsInRoleAsync(user, role);
        }

        //public async Task<bool> AuthorizeAsync(string userId, string policyName)
        //{
        //    var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

        //    if (user == null)
        //    {
        //        return false;
        //    }

        //    var principal = await _userClaimsPrincipalFactory.CreateAsync(user);

        //    var result = await _authorizationService.AuthorizeAsync(user.Id, policyName);

        //    return result;
        //}



        public async Task<Result> DeleteUserAsync(string userId)
        {
            var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);
            var serviceResult = new Result();
            return user != null ? await DeleteUserAsync(user) : serviceResult.Succeed();
        }

        private async Task<Result> DeleteUserAsync(ApplicationUser user)
        {
            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded ? new Result().Succeed() : new Result().Fail();
        }

        public async Task<Result<PublicUser>> CreateUserAsync(CreateUserBase user, string password, List<string> roles, bool isActive = true)
        {
            var serviceResult = new Result<PublicUser>().Succeed();
            try
            {
                var applicationUser = _mapper.Map<ApplicationUser>(user);

                var profilePict = await _fileHelper.SaveFilesAsync(user.ProfilePictureFile);
                if (profilePict != null && profilePict.IsFailed)
                {
                    serviceResult.AddErrors(profilePict.Errors);
                    return serviceResult.Fail();
                }
                applicationUser.ProfilePictureId = profilePict?.Data.Id;


                applicationUser.UserName = applicationUser.Email;
                applicationUser.Id = Guid.NewGuid().ToString();
                applicationUser.IsActive = isActive;
                applicationUser.MustChangePassword = false;
                var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
                using (transaction)
                {
                    var identityResult = await _userManager.CreateAsync(applicationUser, password);

                    if (!identityResult.Succeeded)
                    {
                        serviceResult.Fail().WithErrors(_mapper.Map<List<ResultError>>(identityResult.Errors));
                    }
                    else if (roles?.Any() ?? false)
                    {
                        var rolesResult = await _userManager.AddToRolesAsync(applicationUser, roles.Select(nr => nr.ToUpper()));
                        if (!rolesResult.Succeeded)
                            serviceResult.Fail().WithErrors(_mapper.Map<List<ResultError>>(identityResult.Errors));
                    }
                    else
                        serviceResult.Succeed();

                    serviceResult.Data = _mapper.Map<PublicUser>(applicationUser);
                    transaction.Complete();
                }
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to create user.");
            }
            return serviceResult;
        }

        public async Task<Result> ActivateUserAsync(string username)
        {
            var serviceResult = new Result();
            try
            {
                var applicationUser = await _userManager.FindByNameAsync(username);

                var validationResult = ValidateUserForActivation(applicationUser);
                if (validationResult.IsFailed)
                    return validationResult;

                applicationUser.IsActive = true;
                var result = await _userManager.UpdateAsync(applicationUser);

                if (result.Succeeded)
                {
                    serviceResult.Succeed();
                }
                else
                {
                    serviceResult.Fail().WithMessage($"Unable to activate user.");
                }
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to activate user.");
            }
            return serviceResult;
        }

        public async Task<Result> DeactivateUserAsync(string username)
        {
            var serviceResult = new Result();
            try
            {
                var applicationUser = await _userManager.FindByNameAsync(username);

                if (applicationUser == null)
                    return serviceResult.Fail().WithMessage("User not found.");

                if (!applicationUser.IsActive)
                    return serviceResult.Fail().WithMessage("User is not active.");

                applicationUser.IsActive = false;
                var result = await _userManager.UpdateAsync(applicationUser);

                if (result.Succeeded)
                {
                    serviceResult.Succeed();
                }
                else
                {
                    serviceResult.Fail().WithMessage($"Unable to deactivate user.");
                }
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to deactivate user.");

            }

            return serviceResult;
        }

        public async Task<Result> AddRolesAsync(UserRoleAssignment request)
        {
            var serviceResult = new Result().Succeed();
            try
            {
                var applicationUser = await _userManager.FindByNameAsync(request.Username);

                if (applicationUser == null)
                    return serviceResult.Fail().WithMessage("User not found.");

                var validationResult = await ValidateRolesForAdditionAsync(request.Roles, applicationUser);
                if (validationResult.IsFailed)
                    return validationResult;

                var result = await _userManager.AddToRolesAsync(applicationUser, request.Roles.Select(nr => nr.ToUpper()));

                if (result.Succeeded)
                    serviceResult.Succeed();
                else
                    serviceResult.Fail().WithMessage($"Unable to add role user.");
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to add role to user.");
            }

            return serviceResult;
        }

        public async Task<Result> RemoveRolesAsync(UserRoleAssignment request)
        {
            var serviceResult = new Result();
            try
            {
                var applicationUser = await _userManager.FindByNameAsync(request.Username);
                if (applicationUser == null)
                    return serviceResult.Fail().WithMessage("User not found.");

                var validationResult = await ValidateRolesForRemovalAsync(request.Roles, applicationUser);
                if (validationResult.IsFailed)
                    return validationResult;

                var result = await _userManager.RemoveFromRolesAsync(applicationUser, request.Roles.Select(r => r.ToUpper()));

                if (result.Succeeded)
                    serviceResult.Succeed();
                else
                    serviceResult.Fail().WithMessage($"Unable to remove role from user.");
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to remove role from user.");
            }

            return serviceResult;
        }

        public async Task<Result> ChangePasswordAsync(string userId, string oldPassword, string newPassword)
        {
            var serviceResult = new Result();
            try
            {

                var applicationUser = await _userManager.FindByIdAsync(userId);
                if (applicationUser == null)
                {
                    return serviceResult.Fail().WithMessage("User not found.");
                }

                var changePasswordResult = await _userManager.ChangePasswordAsync(applicationUser, oldPassword, newPassword);
                if (!changePasswordResult.Succeeded)
                {
                    serviceResult.Fail();
                    foreach (var error in changePasswordResult.Errors)
                    {
                        serviceResult.AddError(error.Description, error.Code);
                    }
                    return serviceResult.WithMessage("Unable to change user password");
                }

                serviceResult.Succeed();
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to change user password.");
            }

            return serviceResult;
        }

        public async Task<Result> ResetPasswordAsync(string id, string token, string password)
        {
            var serviceResult = new Result();
            try
            {

                var applicationUser = await _userManager.FindByIdAsync(id);
                if (applicationUser == null)
                {
                    return serviceResult.Fail().WithMessage("User not found.");
                }

                var resetPasswordResult = await _userManager.ResetPasswordAsync(applicationUser, token, password);
                if (!resetPasswordResult.Succeeded)
                {
                    serviceResult.Fail();
                    foreach (var error in resetPasswordResult.Errors)
                    {
                        serviceResult.AddError(error.Description, error.Code);
                    }

                    return serviceResult.WithMessage("Unable to reset user password");
                }

                serviceResult.Succeed();

            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to reset user password.");
            }

            return serviceResult;
        }

        public async Task<PagedResult<GetUser>> GetAllUsersAsync(QueryOptions options)
        {
            var serviceResult = new PagedResult<GetUser>();
            try
            {
                var query = _userManager.Users.AsNoTracking()
                    .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .Include(x => x.ProfileBackground)
                    .Include(x => x.ProfilePicture).AsQueryable();
                serviceResult.GetPaged(query, options.PageNo, options.PageSize);

                query = query.Where(c =>
                    c.UserRoles.Any(x => x.Role.NormalizedName != null && x.Role.NormalizedName.Equals("USER")));
                if (!string.IsNullOrWhiteSpace(options?.SearchTerm))
                {
                    query = query.Where(c => string.IsNullOrEmpty(options.SearchTerm) ||
                                             c.Name.Contains(options.SearchTerm)
                                             || c.LastName.Contains(options.SearchTerm)
                                             || c.Info.Contains(options.SearchTerm)
                                                                  //|| EF.Functions.Contains(c.Email, $"%{options.SearchTerm}%")
                                                                  );
                }

                if (!string.IsNullOrWhiteSpace(options?.OrderBy.ToString()))
                {
                    options.ApplyOrderBy(query, x => x.Id, x => x.CreatedDate);
                }

                if (options?.Skip != null && options?.PageSize != null)
                {
                    query = query.Skip(options.Skip);
                    query = query.Take(options.PageSize);
                }
                query = query.Select(user => new UserAggregate
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Name = user.Name,
                    LastName = user.LastName,
                    ProfilePictureId = user.ProfilePictureId,
                    ProfilePicture = user.ProfilePicture,
                    IsActive = user.IsActive,
                    MustChangePassword = user.MustChangePassword,
                    Culture = user.Culture,
                    UICulture = user.UICulture,
                    Social = user.Social,
                    Website = user.Website,
                    Info = user.Info,
                    ProfileBackgroundId = user.ProfileBackgroundId,
                    ProfileBackground = user.ProfileBackground,
                    //  UserRoles = user.UserRoles.Select(ur => new ApplicationUserRoleDto { /* Map properties from ApplicationUserRole */ }).ToList(),
                    CreatedBy = user.CreatedBy,
                    CreatedDate = user.CreatedDate,
                    ModifiedBy = user.ModifiedBy,
                    ModifiedOn = user.ModifiedOn

                });
                List<GetUser> listOfUsers = new List<GetUser>();
                foreach (var user in await query.ToListAsync())
                {
                    var tempData = _mapper.Map<GetUser>(user);

                    tempData.DataProfilePicture = await _fileService.GetBase64File(user.ProfilePicture?.FileGuid.ToString() ?? null,
                        user.ProfilePicture?.FileExtension);
                    listOfUsers.Add(tempData);
                }
                serviceResult.Data = listOfUsers;

                serviceResult.Succeed();
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to retrieve all users.");
            }
            return serviceResult;
        }

        public async Task<PagedResult<PublicUser>> GetRecentUserAsync(QueryOptions? options = null)
        {
            var serviceResult = new PagedResult<PublicUser>();
            try
            {
                var query = _userManager.Users.AsNoTracking()
                    .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .Include(x => x.ProfileBackground)
                    .Include(x => x.ProfilePicture)
                    .AsQueryable();
                query = query.Where(c =>
                    c.UserRoles.Any(x => x.Role.NormalizedName != null && x.Role.NormalizedName.Equals("USER")));
                serviceResult.GetPaged(query, options.PageNo, options.PageSize);
                if (!string.IsNullOrWhiteSpace(options?.SearchTerm))
                {
                    query = query.Where(c =>
                        c.Name.Contains(options.SearchTerm)
                        || c.LastName.Contains(options.SearchTerm)
                        || c.Info.Contains(options.SearchTerm)
                      
                    //  || EF.Functions.Contains(c.Email, $"%{options.SearchTerm}%")
                    );
                }

                //query = query.OrderByDescending(user => user.Podcast.Max(x => x.CreatedDate));
                //if (!string.IsNullOrWhiteSpace(options?.OrderBy.ToString()))
                //{
                //    options.ApplyOrderBy(query, x => x.Id, x => x.Podcast.Max(x=>x.CreatedDate));
                //}

                if (options?.Skip != null && options?.PageSize != null)
                {
                    query = query.Skip(options.Skip);
                    query = query.Take(options.PageSize);
                }

                query = query.Select(user => new UserAggregate
                {

                    Id = user.Id,
                    UserName = user.UserName,
                    Name = user.Name,
                    LastName = user.LastName,
                    ProfilePictureId = user.ProfilePictureId,
                    ProfilePicture = user.ProfilePicture,
                    IsActive = user.IsActive,
                    MustChangePassword = user.MustChangePassword,
                    Culture = user.Culture,
                    UICulture = user.UICulture,
                    Social = user.Social,
                    Website = user.Website,
                    Info = user.Info,
                    ProfileBackgroundId = user.ProfileBackgroundId,
                    ProfileBackground = user.ProfileBackground,
                    //  UserRoles = user.UserRoles.Select(ur => new ApplicationUserRoleDto { /* Map properties from ApplicationUserRole */ }).ToList(),
                    CreatedBy = user.CreatedBy,
                    CreatedDate = user.CreatedDate,
                    ModifiedBy = user.ModifiedBy,
                    ModifiedOn = user.ModifiedOn


                });

                List<PublicUser> listOfUsers = new List<PublicUser>();
                foreach (var user in await query.ToListAsync())
                {
                    var tempData = _mapper.Map<PublicUser>(user);

                  
                    tempData.DataProfilePicture =
                       await _fileService.GetBase64File(user.ProfilePicture?.FileGuid.ToString() ?? null,
                            user.ProfilePicture?.FileExtension);


                    listOfUsers.Add(tempData);
                }
                serviceResult.Data = listOfUsers;

                serviceResult.Succeed();
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to retrieve all users.");
            }
            return serviceResult;
        }

        public async Task<Result<GetUser>> GetUserByIdAsync(string id)
        {
            var serviceResult = new Result<GetUser>();
            try
            {
                var userWithRoles = await _userManager.Users.AsNoTracking()
                    .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .Include(x => x.ProfileBackground)
                    .Include(x => x.ProfilePicture)
                    .FirstOrDefaultAsync(u => u.Id == id);
                if (userWithRoles == null || userWithRoles.UserRoles.Any(x => x.Role.Name is "Admin" or "Superadmin"))
                {
                    serviceResult.Fail().WithError($"Unable to load user with ID '{id}'.");
                    return serviceResult;
                }
                var tempData = _mapper.Map<GetUser>(userWithRoles);
              
                tempData.DataProfilePicture = await _fileService.GetBase64File(userWithRoles.ProfilePicture?.FileGuid.ToString() ?? null,
                    userWithRoles.ProfilePicture?.FileExtension);
                serviceResult.Data = tempData;
                serviceResult.Succeed();
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to get the user by id.");
            }

            return serviceResult;
        }

        public async Task<Result<GetUser>> GetUserByEmailAsync(string email)
        {
            var serviceResult = new Result<GetUser>();
            try
            {
                var userWithRoles = await _userManager.Users.AsNoTracking()
                    .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .Include(x => x.ProfileBackground)
                    .Include(x => x.ProfilePicture)
                    .FirstOrDefaultAsync(u => u.NormalizedEmail == email.ToUpper());
                if (userWithRoles == null || userWithRoles.UserRoles.Any(x => x.Role.Name is "Superadmin"))
                {
                    serviceResult.Fail().WithError($"Unable to load user with Email '{email}'.");
                    return serviceResult;
                }
                var tempData = _mapper.Map<GetUser>(userWithRoles);
           
                tempData.DataProfilePicture =await _fileService.GetBase64File(userWithRoles.ProfilePicture?.FileGuid.ToString() ?? null,
                    userWithRoles.ProfilePicture?.FileExtension);
                serviceResult.Data = tempData;
                serviceResult.Succeed();
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to get the user by email.");
            }

            return serviceResult;
        }
        public async Task<Result<ApplicationUser>> GetApplicationUserByEmailAsync(string email)
        {
            var serviceResult = new Result<ApplicationUser>();
            try
            {
                var userWithRoles = await _userManager.Users.AsNoTracking()
                    .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .Include(x => x.ProfileBackground)
                    .Include(x => x.ProfilePicture)
                    .FirstOrDefaultAsync(u => u.NormalizedEmail == email.ToUpper());
                if (userWithRoles == null || userWithRoles.UserRoles.Any(x => x.Role.Name is "Superadmin"))
                {
                    serviceResult.Fail().WithError($"Unable to load user with Email '{email}'.");
                    return serviceResult;
                }
            
                serviceResult.Data = userWithRoles;
                serviceResult.Succeed();
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to get the user by email.");
            }

            return serviceResult;
        }
        public async Task<Result<User>> GetUserByNameAsync(string username)
        {
            var serviceResult = new Result<User>();
            try
            {
                ApplicationUser user = await _userManager.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserName == username);
                if (user != null)
                {
                    serviceResult.Data = _mapper.Map<User>(user);
                }

                serviceResult.Succeed();
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to get the user by username.");
            }

            return serviceResult;
        }

        public async Task<Result> UpdateRolesAsync(string username, List<string> roles)
        {
            var serviceResult = new Result();
            try
            {
                var applicationUser = await _userManager.FindByNameAsync(username);
                if (applicationUser == null)
                {
                    return serviceResult.Fail().WithMessage("User not found.");
                }

                var existingRoles = await _userManager.GetRolesAsync(applicationUser);
                var identityResult = await _userManager.RemoveFromRolesAsync(applicationUser, existingRoles);

                if (!identityResult.Succeeded)
                {

                    return serviceResult.Fail().WithMessage($"Unable to update user roles.");
                }

                identityResult = await _userManager.AddToRolesAsync(applicationUser, roles.Select(r => r.ToUpper()));

                if (identityResult.Succeeded)
                {
                    serviceResult.Succeed();
                }
                else
                {
                    serviceResult.Fail().WithMessage($"Unable to update user roles.");
                }
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to update roles of user.");
            }

            return serviceResult;
        }

        public async Task<Result<PublicUser>> UpdateUserDetailsAsync(string userId, UpdateUser request)
        {
            var serviceResult = new Result<PublicUser>();
            try
            {

                var applicationUser = await _userManager.FindByIdAsync(userId);

                if (applicationUser == null)
                    return serviceResult.Fail().WithMessage("User not found.");

                if (!string.IsNullOrWhiteSpace(request.Email) && applicationUser.Email != request.Email)
                    applicationUser.Email = request.Email;

                if (!string.IsNullOrWhiteSpace(request.Name) && applicationUser.Name != request.Name)
                    applicationUser.Name = request.Name;
                if (!string.IsNullOrWhiteSpace(request.LastName) && applicationUser.LastName != request.LastName)
                    applicationUser.LastName = request.LastName;

                applicationUser.Info = request.Info;
                applicationUser.Social = request.Social;
                applicationUser.Website = request.Website;
                if (!request.IsActive != null && applicationUser.IsActive != request.IsActive)
                    applicationUser.IsActive = Convert.ToBoolean(request.IsActive);

                var profilePict = await _fileHelper.SaveFilesAsync(request.ProfilePictureFile);
                if (profilePict != null && profilePict.IsFailed)
                {
                    serviceResult.AddErrors(profilePict.Errors);
                    return serviceResult.Fail();
                }
                applicationUser.ProfilePictureId = profilePict?.Data.Id;

                var result = await _userManager.UpdateAsync(applicationUser);

                if (result.Succeeded)
                {
                    serviceResult.Succeed();
                }
                else
                {
                    serviceResult.Fail().WithMessage($"Unable to update user details.");
                }
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to update user details.");
            }

            return serviceResult;
        }


        public async Task<Result<string>> GenerateEmailConfirmationTokenAsync(string userEmail)
        {
            var serviceResult = new Result<string>();
            try
            {
                var appUser = await _userManager.FindByEmailAsync(userEmail);
                if (appUser == null)
                {
                    return serviceResult.Fail().WithError("User not found!");
                }
                if (appUser.EmailConfirmed)
                {
                    return serviceResult.Fail().WithError("Email Already confirmed!");
                }
                string token = await _userManager.GenerateEmailConfirmationTokenAsync(appUser);

                serviceResult.Succeed().WithData(token);
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to generate email confirmation token.");
            }
            return serviceResult;
        }

        public async Task<Result> ConfirmUserEmailAsync(string userId, string code)
        {
            Result serviceResult = new Result();
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return serviceResult.Fail().WithError($"Unable to load user with ID '{userId}'.");
                }

                var confirmationResult = await _userManager.ConfirmEmailAsync(user, code);
                if (confirmationResult.Succeeded)
                {
                    serviceResult.Succeed();

                }
                else
                {
                    serviceResult.Fail().WithError("Unable to confirm user email");
                }
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to confirm user email.");
            }

            return serviceResult;
        }

        public async Task<Result<string>> GeneratePasswordResetTokenAsync(string userEmail,bool checkEmailConfirmed = true)
        {
            Result<string> serviceResult = new Result<string>();
            try
            {
                var user = await _userManager.FindByEmailAsync(userEmail);
                if (user == null)// || (!checkEmailConfirmed && !(await _userManager.IsEmailConfirmedAsync(user))))
                {
                    return serviceResult.Fail().WithError("User not found or email is not confirmed");
                }

                string code = await _userManager.GeneratePasswordResetTokenAsync(user);
                serviceResult.Succeed().WithData(code);

            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to generate password reset token.");
            }
            return serviceResult;
        }

        public async Task<Result<bool>> GetTwoFactorAuthenticationStatusAsync(string userId)
        {
            Result<bool> serviceResult = new Result<bool>();
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                bool twoFactorIsEnabled = await _userManager.GetTwoFactorEnabledAsync(user);
                serviceResult.Succeed().WithData(twoFactorIsEnabled);

            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to get two-factor authentication status for user.");
            }
            return serviceResult;
        }

        public async Task<Result> DisableTwoFactorAuthenticationAsync(string userId)
        {
            Result serviceResult = new Result();
            try
            {

                var user = await _userManager.FindByIdAsync(userId);
                var twoFactorResult = await _userManager.SetTwoFactorEnabledAsync(user, false);
                if (!twoFactorResult.Succeeded)
                {
                    return serviceResult.Fail().WithError($"Cannot disable 2FA for user as it's not currently enabled.");
                }
                serviceResult.Succeed();
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to disable two-factor authentication for user.");
            }
            return serviceResult;
        }

        public async Task<Result<Dictionary<string, string>>> GetUserPersonalDataAsync(string userId)
        {
            Result<Dictionary<string, string>> serviceResult = new Result<Dictionary<string, string>>();
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                var personalData = new Dictionary<string, string>();
                var personalDataProps = typeof(ApplicationUser).GetProperties().Where(
                                prop => Attribute.IsDefined(prop, typeof(PersonalDataAttribute)));
                foreach (var p in personalDataProps)
                {
                    personalData.Add(p.Name, p.GetValue(user)?.ToString() ?? "null");
                }

                var logins = await _userManager.GetLoginsAsync(user);
                foreach (var l in logins)
                {
                    personalData.Add($"{l.LoginProvider} external login provider key", l.ProviderKey);
                }

                personalData.Add($"Authenticator Key", await _userManager.GetAuthenticatorKeyAsync(user));

                serviceResult.Succeed().WithData(personalData);

            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to get user personal data.");
            }
            return serviceResult;
        }

        public async Task<Result> EnableAuthenticatorAsync(string userId, string verificationCode)
        {
            Result serviceResult = new Result();
            try
            {

                var user = await _userManager.FindByIdAsync(userId);
                //Check for valid 2FA token
                bool is2faTokenValid = await _userManager.VerifyTwoFactorTokenAsync(user, _userManager.Options.Tokens.AuthenticatorTokenProvider, verificationCode);
                if (!is2faTokenValid)
                {
                    return serviceResult.Fail().WithError("Verification code is invalid.");
                }

                await _userManager.SetTwoFactorEnabledAsync(user, true);
                serviceResult.Succeed();
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to enable authenticator for user.");
            }
            return serviceResult;
        }

        public async Task<Result> ResetAuthenticatorAsync(string userId)
        {
            Result serviceResult = new Result();
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                await _userManager.SetTwoFactorEnabledAsync(user, false);
                await _userManager.ResetAuthenticatorKeyAsync(user);

                return serviceResult.Succeed();
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to reset authenticator for user.");
            }
            return serviceResult;
        }

        public async Task<Result<string>> GetAuthenticatorKeyAsync(string userId)
        {
            Result<string> serviceResult = new();
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                // Load the authenticator key & QR code URI to display on the form
                string authKey = await _userManager.GetAuthenticatorKeyAsync(user);
                serviceResult.Succeed().WithData(authKey);

            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to get authenticator key for user.");
            }
            return serviceResult;
        }

        public async Task<Result<(string SharedKey, string AuthenticatorUri)>> GetAuthenticatorSharedKeyAndQrCodeUriAsync(string userId)
        {
            Result<(string SharedKey, string AuthenticatorUri)> serviceResult = new();
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null) return serviceResult.Fail().WithError("User not found!");
                // Load the authenticator key & QR code URI to display on the form
                var unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);
                if (string.IsNullOrEmpty(unformattedKey))
                {
                    await _userManager.ResetAuthenticatorKeyAsync(user);
                    unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);
                }

                string sharedKey = FormatAuthenticatorKey(unformattedKey);
                string authenticatorUri = GenerateAuthenticatorQrCodeUri(user.Email, unformattedKey);

                serviceResult.Succeed().WithData((sharedKey, authenticatorUri));
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to get authenticator shared key and qr code uri for user.");
            }
            return serviceResult;
        }

        public async Task<Result<IEnumerable<string>>> GenerateTwoFactorRecoveryCodesAsync(string userId, int numberOfCodesToGenerate)
        {
            Result<IEnumerable<string>> serviceResult = new();
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                int userExistingRecoveryCodesCount = await _userManager.CountRecoveryCodesAsync(user);
                if (userExistingRecoveryCodesCount > 0)
                {
                    //        _logger.LogWarning($"Unable to generate new recovery codes for user '{userId}'. User already has {userExistingRecoveryCodesCount} recovery codes generated");
                    return serviceResult.Fail().WithMessage("User already has recovery codes generated");
                }

                var recoveryCodes = await _userManager.GenerateNewTwoFactorRecoveryCodesAsync(user, numberOfCodesToGenerate);

                return serviceResult.Succeed().WithData(recoveryCodes);
            }
            catch (Exception ex)
            {
                ServicesHelper.HandleServiceError(ref serviceResult, _logger, ex, "Error while trying to generate 2FA recovery codes for user.");
            }
            return serviceResult;
        }

        private static Result<string> ValidateUserForActivation(ApplicationUser applicationUser)
        {
            var serviceResult = new Result<string>();
            if (applicationUser == null)
                return serviceResult.Fail().WithMessage("User not found.");

            if (applicationUser.IsActive)
                return serviceResult.Fail().WithMessage("User is already active.");
            return serviceResult;
        }

        private async Task<Result> ValidateRolesForAdditionAsync(List<string> roles, ApplicationUser applicationUser)
        {
            Result validationResult = new Result();
            var rolesAlreadyAssigned = await GetAlreadyAssignedRolesFromUserAsync(roles, applicationUser);
            var invalidRoles = GetInvalidRoles(roles);

            if (rolesAlreadyAssigned.Any())
                return validationResult.Fail().WithErrors(rolesAlreadyAssigned.Select(r => new ResultError($"Role {r} is already assigned.")).ToList());

            if (invalidRoles.Any())
                return validationResult.Fail().WithErrors(invalidRoles.Select(r => new ResultError($"Role {r} is invalid.")).ToList());

            return validationResult.Succeed();
        }

        private async Task<Result> ValidateRolesForRemovalAsync(List<string> roles, ApplicationUser applicationUser)
        {
            Result validationResult = new Result();
            var invalidRoles = GetInvalidRoles(roles);
            var rolesNotAssigned = await GetUnassignedRolesFromUserAsync(roles, applicationUser);

            if (rolesNotAssigned.Any())
                return validationResult.Fail().WithErrors(rolesNotAssigned.Select(r => new ResultError($"Role {r} is not assigned.")).ToList());

            if (invalidRoles.Any())
                return validationResult.Fail().WithErrors(invalidRoles.Select(r => new ResultError($"Role {r} is invalid.")).ToList());

            return validationResult.Succeed();
        }

        private static List<string> GetInvalidRoles(List<string> rolesToCheck)
        {
            List<string> invalidRoles = new List<string>();
            foreach (var roleToCheck in rolesToCheck)
            {
                var isRoleInvalid = !Enum.IsDefined(typeof(RoleEnum), roleToCheck);
                if (isRoleInvalid)
                    invalidRoles.Add(roleToCheck);
            }
            return invalidRoles;
        }

        private async Task<List<string>> GetUnassignedRolesFromUserAsync(List<string> rolesToCheck, ApplicationUser applicationUser)
        {
            List<string> rolesNotAssigned = new List<string>();
            foreach (var roleToCheck in rolesToCheck)
            {
                bool isRoleAssigned = await _userManager.IsInRoleAsync(applicationUser, roleToCheck.ToUpper());
                if (isRoleAssigned == false)
                    rolesNotAssigned.Add(roleToCheck);
            }
            return rolesNotAssigned;
        }

        private async Task<List<string>> GetAlreadyAssignedRolesFromUserAsync(List<string> rolesToCheck, ApplicationUser applicationUser)
        {
            List<string> rolesAssigned = new List<string>();
            foreach (var roleToCheck in rolesToCheck)
            {
                if (await _userManager.IsInRoleAsync(applicationUser, roleToCheck.ToUpper()))
                {
                    rolesAssigned.Add(roleToCheck);
                }
            }
            return rolesAssigned;
        }

        private static string FormatAuthenticatorKey(string unformattedKey)
        {
            var result = new StringBuilder();
            int currentPosition = 0;
            while (currentPosition + 4 < unformattedKey.Length)
            {
                result.Append(unformattedKey.AsSpan(currentPosition, 4)).Append(' ');
                currentPosition += 4;
            }
            if (currentPosition < unformattedKey.Length)
            {
                result.Append(unformattedKey.AsSpan(currentPosition));
            }

            return result.ToString().ToLowerInvariant();
        }

        private string GenerateAuthenticatorQrCodeUri(string email, string unformattedKey)
        {
            return string.Format(
            CultureInfo.InvariantCulture,
            AUTHENTICATOR_URI_FORMAT,
                _urlEncoder.Encode("CleanArchitecture"),
                _urlEncoder.Encode(email),
                unformattedKey);
        }

    }
}
