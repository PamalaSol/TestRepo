using FluentValidation;

namespace CleanArchFramework.Application.Features.About.Command.CreateAbout
{
    internal class CreateAboutCommandValidator : AbstractValidator<CreateAboutCommand>
    {
        public CreateAboutCommandValidator()
        {
            RuleFor(p => p.Title)
                .MaximumLength(500).WithMessage("{Title} must not exceed 500 characters.");

        }
    }
}
