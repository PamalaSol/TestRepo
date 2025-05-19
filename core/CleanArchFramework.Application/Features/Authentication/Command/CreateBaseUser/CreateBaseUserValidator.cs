using FluentValidation;

namespace CleanArchFramework.Application.Features.Authentication.Command.CreateBaseUser
{
    public class CreateBaseUserValidator : AbstractValidator<Models.Authentication.CreateUserWithPassword>
    {
        public CreateBaseUserValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("{Name} is required.")
                .NotNull()
                .MaximumLength(50).WithMessage("{Name} must not exceed 50 characters.");

            RuleFor(p => p.LastName)
                .NotEmpty().WithMessage("{LastName} is required.")
                .NotNull()
                .MaximumLength(150).WithMessage("{LastName} must not exceed 150 characters.");
         

            RuleFor(p => p.Password)
                .NotEmpty().WithMessage("{Password} is required.")
                .NotNull()
                .MinimumLength(6).WithMessage("Password must be at least 6 characters");

            RuleFor(p => p.ConfirmPassword)
                .NotEmpty().WithMessage("{ConfirmPassword} is required.")
                .NotNull()
                .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .Equal(model => model.Password).WithMessage("Password and confirmation must match");

            RuleFor(p => p.Email)
                .NotEmpty().WithMessage("{Email} is required.")
                .NotNull()
                .EmailAddress().WithMessage("Invalid email address")
                .MaximumLength(1000).WithMessage("{Email} must not exceed 500 characters.");

        }
    }
}
