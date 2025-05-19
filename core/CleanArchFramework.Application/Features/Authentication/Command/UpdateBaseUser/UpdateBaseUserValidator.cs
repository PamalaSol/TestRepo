using FluentValidation;

namespace CleanArchFramework.Application.Features.Authentication.Command.UpdateBaseUser
{

    public class UpdateBaseUserValidator : AbstractValidator<Models.Authentication.Public.UpdateUserBase>
    {
        public UpdateBaseUserValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("{Name} is required.")
                .NotNull()
                .MaximumLength(50).WithMessage("{Name} must not exceed 50 characters.");

            RuleFor(p => p.LastName)
                .NotEmpty().WithMessage("{LastName} is required.")
                .NotNull()
                .MaximumLength(150).WithMessage("{LastName} must not exceed 150 characters.");


        }
    }
}
