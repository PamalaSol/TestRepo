using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Application.Contracts.Infrastructure.Communication;
using CleanArchFramework.Application.Shared.Options.ConfigOptions;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.Extensions.Options;

namespace CleanArchFramework.Application.Features.Authentication.Command.ChangePassword
{
    public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Result>
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly EnvironmentOptions _environmentOptions;
        private readonly IEmailService _emailService;

        public ChangePasswordCommandHandler(IAuthenticationService authenticationService,
            IOptions<EnvironmentOptions> environmentOptions, IEmailService emailService)
        {
            _authenticationService = authenticationService;
            _environmentOptions = environmentOptions.Value;
            _emailService = emailService;
        }

        public async Task<Result> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
            {

                var changePasswordResult = new Result();
                var validator = new ChangePasswordValidator();
                var validationResult = await validator.ValidateAsync(request, cancellationToken);

                if (validationResult.Errors.Count > 0)
                {
                    changePasswordResult.IsSuccessful = false;
                    foreach (var error in validationResult.Errors)
                    {
                        changePasswordResult.WithError(error.ErrorMessage);
                    }
                }
                else
                {
                    changePasswordResult.Succeed();
                    var result = await _authenticationService.ChangePasswordAsync(request.UserId,request.OldPassword,request.Password);
                    if (result.IsSuccessful)
                    {
                        var user = await _authenticationService.GetUserByIdAsync(request.UserId);
                        await _emailService.SendEmailAsync(user.Data.Email, "Subject: Password reset! - Punk.xyz",
                            $"Successfully reset password! " +
                            $"<br/>We're excited to have you as a member of our vibrant community.\r\n\r\n" +
                            $"<br/>Best regards,\r\n\r\n" +
                            $"<br/>The Punk.xyz Team\r\n[Punk.xyz]r\n" +
                            $"<br/>[Your Contact Information]");
                    }
                    return result;
                }

                return changePasswordResult;
            }
        }
}
