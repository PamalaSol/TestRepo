using FluentValidation;

namespace CleanArchFramework.Application.Features.About.Command.DeleteAbout
{
    public class AboutCommandValidator : AbstractValidator<DeleteAboutCommand>
    {
        public AboutCommandValidator()
        {
            RuleFor(p => p.Id)
                .NotEmpty().WithMessage("{Id} is required.")
                .NotNull();
        }
    }
}
