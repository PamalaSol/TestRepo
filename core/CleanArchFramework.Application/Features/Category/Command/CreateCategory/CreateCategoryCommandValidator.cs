using FluentValidation;

namespace CleanArchFramework.Application.Features.Category.Command.CreateCategory
{
    internal class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
    {
        public CreateCategoryCommandValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("{Name} is required.")
                .NotNull()
                .MaximumLength(150).WithMessage("{Name} must not exceed 150 characters.");

            RuleFor(p => p.Description)
                .MaximumLength(50).WithMessage("{Description} must not exceed 5000 characters.");


        }
    }
}
