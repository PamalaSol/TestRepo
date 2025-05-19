using FluentValidation;

namespace CleanArchFramework.Application.Features.Authentication.Command.GenerateEmailConfirmationToken
{

    public class GenerateEmailConfirmationTokenValidator : AbstractValidator<GenerateEmailConfirmationTokenCommand>
    {
        public GenerateEmailConfirmationTokenValidator()
        {
            RuleFor(p => p.Email)
                .NotEmpty().WithMessage("{Email} is required.")
                .NotNull()
                .EmailAddress()
                .MaximumLength(250).WithMessage("{Email} must not exceed 250 characters.");
           


        }
    }
}
