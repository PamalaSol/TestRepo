using System.Web;
using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Application.Contracts.Infrastructure.Communication;
using CleanArchFramework.Application.Models.Authentication.Public;
using CleanArchFramework.Application.Shared.Options.ConfigOptions;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.Extensions.Options;

namespace CleanArchFramework.Application.Features.Authentication.Command.GenerateEmailConfirmationToken
{
    public class GenerateEmailConfirmationTokenCommandHandler : IRequestHandler<GenerateEmailConfirmationTokenCommand, Result<PublicUser>>
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IEmailService _emailService;
        private readonly EnvironmentOptions _environmentOptions;

        public GenerateEmailConfirmationTokenCommandHandler(IAuthenticationService authenticationService, IEmailService emailService, IOptions<EnvironmentOptions> environmentOptions)
        {
            _authenticationService = authenticationService;
            _emailService = emailService;
            _environmentOptions = environmentOptions.Value;
        }

        public async Task<Result<PublicUser>> Handle(GenerateEmailConfirmationTokenCommand request, CancellationToken cancellationToken)
        {

            var createUserValidator = new Result<PublicUser>();

            var validator = new GenerateEmailConfirmationTokenValidator();
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
                var user = await _authenticationService.GetUserByEmailAsync(request.Email);
                if (user is { IsSuccessful: true, Data.Email: not null })
                {

                    var emailConfirmationToken = await
                        _authenticationService.GenerateEmailConfirmationTokenAsync(user.Data.Email);
                    var codeEncoded = HttpUtility.UrlEncode(emailConfirmationToken.Data);
                    var emailLink = _environmentOptions.FrontendUrl + "/confirm/" + user.Data.Id + "/" + codeEncoded;


                    await _emailService.SendEmailAsync(request.Email, "Subject: Confirm Your Email - []",
                        $"Dear {user.Data.Name},<br/>\r\n\r\nThank you for signing up with []. " +
                        $"<br/>We're excited to have you as a member of our vibrant community.\r\n\r\n" +
                        $"<br/>Please confirm your email address by clicking the link below:\r\n\r\n  \r\n    <br/> <a href= \" {emailLink} \">Click here to confirm your email</a>\r\n \r\n\r\n" +
                        $"<br/>If the above link does not work, you can copy and paste this URL into your browser: {emailLink}\r\n\r\n" +
                        $"<br/>By confirming your email, you'll have full access to your [] account, including your personalized collection, latest releases, and community features.\r\n\r\nIf you didn't create an account on [], or if you received this email by mistake, please ignore it – your privacy and security are important to us.\r\n\r\n" +
                        $"<br/>Thank you for choosing [].\r\n\r\n" +
                        $"<br/>Best regards,\r\n\r\n<br/>[] Team\r\n[]r\n<br/>[Your Contact Information]");
                }
                else
                {
                    return createUserValidator.Fail().WithMessage("Invalid user!");
                }
                return createUserValidator.Succeed().WithMessage("Message Send Successfully, please check your Email!");
            }

            return createUserValidator;
        }
    }
}
