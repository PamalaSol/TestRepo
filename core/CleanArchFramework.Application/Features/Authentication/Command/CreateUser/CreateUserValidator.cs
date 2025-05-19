using FluentValidation;

namespace CleanArchFramework.Application.Features.Authentication.Command.CreateUser
{

    public class CreateUserValidator : AbstractValidator<Models.Authentication.CreateUser>
    {
        public CreateUserValidator()
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
                .MinimumLength(6).WithMessage("Password must be at least 6 characters"); ;

            RuleFor(p => p.ConfirmPassword)
                .NotEmpty().WithMessage("{ConfirmPassword} is required.")
                .NotNull()
                .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .Equal(model => model.Password).WithMessage("Password and confirmation must match");

            RuleFor(p => p.Email)
                .NotEmpty().WithMessage("{Email} is required.")
                .NotNull()
                .EmailAddress().WithMessage("Invalid email address")
                .MaximumLength(1000).WithMessage("{Email} must not exceed 1000 characters.");

            RuleFor(p => p.Roles)
                .Must(list => list is { Count: > 0 })
                .WithMessage("Must set roles!");
        }
    }
}
