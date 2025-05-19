using FluentValidation;

namespace CleanArchFramework.Application.Features.Faq.Commands.UpdateFaq
{
    public class UpdateFaqCommandValidator : AbstractValidator<UpdateFaqCommand>
    {
        public UpdateFaqCommandValidator()
        {
            RuleFor(p => p.Question)
                .NotEmpty().WithMessage("{Name} is required.")
                .NotNull()
                .MaximumLength(250).WithMessage("{Name} must not exceed 250 characters.");

            RuleFor(p => p.Answer)
                .NotEmpty().WithMessage("{Answer} is required.")
                .NotNull()
                .MaximumLength(5000).WithMessage("{Answer} must not exceed 5000 characters.");
        }
    }
}