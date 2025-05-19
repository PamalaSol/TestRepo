using CleanArchFramework.Application.Models.Authentication.Public;
using FluentValidation;

namespace CleanArchFramework.Application.Features.Authentication.Validation
{

    public class UpdatePasswordValidator : AbstractValidator<UpdatePassword>
    {
        public UpdatePasswordValidator()
        {
            RuleFor(p => p.Password)
                .NotEmpty().WithMessage("{Password} is required.")
                .NotNull()
                .MinimumLength(6).WithMessage("Password must be at least 6 characters");


            RuleFor(p => p.ConfirmPassword)
                .NotEmpty().WithMessage("{ConfirmPassword} is required.")
                .NotNull()
                .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .Equal(model => model.Password).WithMessage("Password and confirmation must match");
        }
    }
}
