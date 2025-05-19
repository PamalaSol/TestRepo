using FluentValidation;

namespace CleanArchFramework.Application.Features.Contact.Command
{
    public class ContactFormValidation : AbstractValidator<ContactForm>
    {
        public ContactFormValidation()
        {
            RuleFor(p => p.Name)
                .MaximumLength(150).WithMessage("{Name} must not exceed 150 characters.");

            RuleFor(p => p.Message)
                .NotEmpty().WithMessage("{Message} is required.")
                .NotNull()
                .MaximumLength(100).WithMessage("{Message} must not exceed 5000 characters.");

            RuleFor(p => p.Company)
                .MaximumLength(500).WithMessage("{Company} must not exceed 500 characters.");

            RuleFor(p => p.Subject)
                .NotEmpty().WithMessage("{Subject} is required.")
                .NotNull()
                .MaximumLength(500).WithMessage("{Subject} must not exceed 500 characters.");

            RuleFor(p => p.Email)
                .NotEmpty().WithMessage("{Email} is required.")
                .NotNull()
                .EmailAddress().WithMessage("Invalid email address")
                .MaximumLength(500).WithMessage("{Email} must not exceed 500 characters.");
        }
    }
}
