using FluentValidation;

namespace CleanArchFramework.Application.Features.About.Command.UpdateAbout
{
    public class UpdateAboutCommandValidator : AbstractValidator<UpdateAboutCommand>
    {
        public UpdateAboutCommandValidator()
        {
            RuleFor(p => p.Title)
                .MaximumLength(500).WithMessage("{Title} must not exceed 500 characters.");
        }
    }
}