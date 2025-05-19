using FluentValidation;

namespace CleanArchFramework.Application.Features.Faq.Commands.CreateFaq
{
    internal class CreateFaqCommandValidator : AbstractValidator<CreateFaqCommand>
    {
        public CreateFaqCommandValidator()
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
