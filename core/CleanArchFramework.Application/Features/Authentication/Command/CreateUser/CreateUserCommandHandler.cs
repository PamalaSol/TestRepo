using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Application.Contracts.Infrastructure.Communication;
using CleanArchFramework.Application.Shared.Options.ConfigOptions;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using System.Web;
using Microsoft.Extensions.Options;
using CleanArchFramework.Application.Models.Authentication.Public;

namespace CleanArchFramework.Application.Features.Authentication.Command.CreateUser
{
    public class CreateUserCommandHandler : IRequestHandler<Models.Authentication.CreateUser, Result<PublicUser>>
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IEmailService _emailService;
        private readonly EnvironmentOptions _environmentOptions;
        public CreateUserCommandHandler(IAuthenticationService authenticationService, IEmailService emailService, IOptions<EnvironmentOptions> environmentOptions)
        {
            _authenticationService = authenticationService;
            _emailService = emailService;
            _environmentOptions = environmentOptions.Value;
        }

        public async Task<Result<PublicUser>> Handle(Models.Authentication.CreateUser request, CancellationToken cancellationToken)
        {

            var createUserValidator = new Result<PublicUser>();
            var validator = new CreateUserValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

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
                var result = await _authenticationService.CreateUserAsync(request, request.Password, request.Roles, true);
                if (result.IsSuccessful)
                {
                    var emailConfirmationToken = await
                        _authenticationService.GenerateEmailConfirmationTokenAsync(request.Email);
                    var codeEncoded = HttpUtility.UrlEncode(emailConfirmationToken.Data);
                    var emailLink = _environmentOptions.FrontendUrl + "/confirm/" + result.Data.Id + "/" + codeEncoded;

                    await _emailService.SendEmailAsync(request.Email, "Subject: Confirm Your Email - []",
                        $"Dear {request.Name},<br/>\r\n\r\nThank you for signing up with []. " +
                        $"<br/>We're excited to have you as a member of our vibrant community.\r\n\r\n" +
                        $"<br/>Please confirm your email address by clicking the link below:\r\n\r\n  \r\n    <br/> <a href= \" {emailLink} \">Click here to confirm your email</a>\r\n \r\n\r\n" +
                        $"<br/>If the above link does not work, you can copy and paste this URL into your browser: {emailLink}\r\n\r\n" +
                        $"<br/>By confirming your email, you'll have full access to your [] account, including your personalized collection, latest releases, and community features.\r\n\r\nIf you didn't create an account on [], or if you received this email by mistake, please ignore it – your privacy and security are important to us.\r\n\r\n" +
                        $"<br/>Thank you for choosing [].\r\n\r\n" +
                        $"<br/>Best regards,\r\n\r\n<br/>[] Team\r\n[]r\n<br/>[Your Contact Information]");
                }
                return result;
            }

            return createUserValidator;
        }
    }
}
