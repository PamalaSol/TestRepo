using FluentValidation;

namespace CleanArchFramework.Application.Features.Authentication.Command.CreateBaseUserNoPassword
{
    public class CreateBaseUserNoPasswordPasswordValidator : AbstractValidator<Models.Authentication.CreateUserBase>
    {
        public CreateBaseUserNoPasswordPasswordValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("{Name} is required.")
                .NotNull()
                .MaximumLength(50).WithMessage("{Name} must not exceed 50 characters.");

            RuleFor(p => p.LastName)
                .NotEmpty().WithMessage("{LastName} is required.")
                .NotNull()
                .MaximumLength(150).WithMessage("{LastName} must not exceed 150 characters.");

            RuleFor(p => p.Email)
                .NotEmpty().WithMessage("{Email} is required.")
                .NotNull()
                .EmailAddress().WithMessage("Invalid email address")
                .MaximumLength(1000).WithMessage("{Email} must not exceed 500 characters.");

        }
    }
}
