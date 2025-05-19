using System.Web;
using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Application.Contracts.Infrastructure.Communication;
using CleanArchFramework.Application.Models.Authentication.Public;
using CleanArchFramework.Application.Shared.Options.ConfigOptions;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.Extensions.Options;

namespace CleanArchFramework.Application.Features.Authentication.Command.CreateBaseUser
{
    public class CreateBaseUserCommandHandler : IRequestHandler<Models.Authentication.CreateUserWithPassword, Result<PublicUser>>
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly EnvironmentOptions _environmentOptions;
        private readonly IEmailService _emailService;

        public CreateBaseUserCommandHandler(IAuthenticationService authenticationService, IOptions<EnvironmentOptions> environmentOptions, IEmailService emailService)
        {
            _authenticationService = authenticationService;
            _environmentOptions = environmentOptions.Value;
            _emailService = emailService;

        }

        public async Task<Result<PublicUser>> Handle(Models.Authentication.CreateUserWithPassword request, CancellationToken cancellationToken)
        {

            var createBaseUserValidator = new Result<PublicUser>();
            var validator = new CreateBaseUserValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

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
                var result = await _authenticationService.CreateUserAsync(request, request.Password,
                    new List<string> { "User" }, true);
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

            return createBaseUserValidator;
        }
    }
}
