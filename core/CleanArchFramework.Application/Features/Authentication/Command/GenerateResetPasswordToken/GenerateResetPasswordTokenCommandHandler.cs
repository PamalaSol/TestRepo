using System.Web;
using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Application.Contracts.Infrastructure.Communication;
using CleanArchFramework.Application.Exceptions;
using CleanArchFramework.Application.Models.Authentication.Public;
using CleanArchFramework.Application.Shared.Options.ConfigOptions;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.Extensions.Options;

namespace CleanArchFramework.Application.Features.Authentication.Command.GenerateResetPasswordToken
{
    public class GenerateResetPasswordTokenCommandHandler : IRequestHandler<GenerateResetPasswordTokenCommand, Result<PublicUser>>
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IEmailService _emailService;
        private readonly EnvironmentOptions _environmentOptions;

        public GenerateResetPasswordTokenCommandHandler(IAuthenticationService authenticationService, IEmailService emailService, IOptions<EnvironmentOptions> environmentOptions)
        {
            _authenticationService = authenticationService;
            _emailService = emailService;
            _environmentOptions = environmentOptions.Value;
        }

        public async Task<Result<PublicUser>> Handle(GenerateResetPasswordTokenCommand request, CancellationToken cancellationToken)
        {

            var createUserValidator = new Result<PublicUser>();

            if (string.IsNullOrEmpty(request.Email))
            {
                createUserValidator.IsSuccessful = false;
                throw new BadRequestException("Invalid user!");
            }
            else
            {
                createUserValidator.Succeed();
                var emailConfirmationToken = await _authenticationService.GeneratePasswordResetTokenAsync(request.Email);
                var user = await _authenticationService.GetUserByEmailAsync(request.Email);
                if (emailConfirmationToken.IsSuccessful && user is { IsSuccessful: true, Data.Email: not null })
                {
                    var codeEncoded = HttpUtility.UrlEncode(emailConfirmationToken.Data);
                    var resetPasswordLink = _environmentOptions.FrontendUrl + "/resetPassword/" + user.Data.Id + "/" + codeEncoded;

                    await _emailService.SendEmailAsync(user.Data.Email, "Subject: Confirm Your Email - []",
                        $"Dear {user.Data.Name},<br/>\r\n\r\nThank you for signing up with []. " +
                        $"<br/>We're excited to have you as a member of our vibrant community.\r\n\r\n" +
                        $"<br/>Please reset your password by clicking the link below:\r\n\r\n  \r\n    <br/> <a href= \" {resetPasswordLink} \">Click here to reset your password!</a>\r\n \r\n\r\n" +
                        $"<br/>If the above link does not work, you can copy and paste this URL into your browser: {resetPasswordLink}\r\n\r\n" +
                        $"<br/>By confirming your email, you'll have full access to your [] account, including your personalized collection, latest releases, and community features.\r\n\r\nIf you didn't create an account on [], or if you received this email by mistake, please ignore it – your privacy and security are important to us.\r\n\r\n" +
                        $"<br/>Thank you for choosing [].\r\n\r\n" +
                        $"<br/>Best regards,\r\n\r\n<br/>[] Team\r\n[]r\n<br/>[Your Contact Information]");
                }
                else
                {
                    return createUserValidator.Fail().WithError("Invalid user!").WithErrors(emailConfirmationToken.Errors.Select(r => new ResultError($"{r}")).ToList());
                }
                return createUserValidator.Succeed().WithMessage("Message Send Successfully, please check your Email!");
            }
        }
    }
}
