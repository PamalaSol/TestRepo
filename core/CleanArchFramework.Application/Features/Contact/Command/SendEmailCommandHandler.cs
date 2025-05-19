using MediatR;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Application.Contracts.Infrastructure.Communication;
using CleanArchFramework.Application.Shared.Options.ConfigOptions;
using Microsoft.Extensions.Options;

namespace CleanArchFramework.Application.Features.Contact.Command
{

    public class SendEmailCommandHandler : IRequestHandler<ContactForm, Result>
    {
        private readonly IEmailService _emailService;
        private readonly EmailOptions _options;
        public SendEmailCommandHandler(IEmailService emailService, IOptions<EmailOptions> options)
        {
            _emailService = emailService;
            _options = options.Value;
        }

        public async Task<Result> Handle(ContactForm contactForm, CancellationToken cancellationToken)
        {

            var validator = new ContactFormValidation();
            var validationResult = await validator.ValidateAsync(contactForm, cancellationToken);
            var result = new Result();
            if (validationResult.Errors.Count > 0)
            {
                result.Fail();
                foreach (var error in validationResult.Errors)
                {
                    result.WithError(error.ErrorMessage);
                }
                return result;
            }

            result = await _emailService.SendEmailAsync(_options.ContactEmail, contactForm.Subject,
                "Message from: " + contactForm.Email + "</br>" +
                   "From Company: " + contactForm.Company + "</br>" +
                                      "Name: " + contactForm.Name + "</br>" +
                                      contactForm.Message, contactForm.Email);

            result.Message = "";
            return result;
        }
    }
}

