using FluentValidation;

namespace CleanArchFramework.Application.Features.SiteSettings.Commands.DeleteSiteSettings
{
    public class DeleteSiteSettingsCommandValidator : AbstractValidator<DeleteSiteSettingsCommand>
    {
        public DeleteSiteSettingsCommandValidator()
        {
            RuleFor(p => p.Id)
                .NotEmpty().WithMessage("{Id} is required.")
                .NotNull();
        }
    }
}
