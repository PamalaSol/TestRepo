using FluentValidation;

namespace CleanArchFramework.Application.Features.Faq.Commands.DeleteFaq
{
    public class DeleteFaqCommandValidator : AbstractValidator<DeleteFaqCommand>
    {
        public DeleteFaqCommandValidator()
        {
            RuleFor(p => p.Id)
                .NotEmpty().WithMessage("{Id} is required.")
                .NotNull();
        }
    }
}
