using CleanArchFramework.Application.Features.Menu.Commands.CreateMenu;
using FluentValidation;

namespace CleanArchFramework.Application.Features.Menu.Commands.UpdateMenu
{
    public class UpdateMenuCommandValidator : AbstractValidator<UpdateMenuCommand>
    {
        public UpdateMenuCommandValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("{Name} is required.")
                .NotNull()
                .MaximumLength(50).WithMessage("{Name} must not exceed 50 characters.");
        }
    }
}
