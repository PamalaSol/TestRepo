using FluentValidation;

namespace CleanArchFramework.Application.Features.FileCategory.Command.UpdateFileCategory
{
    public class UpdateFileCategoryCommandValidator : AbstractValidator<UpdateFileCategoryCommand>
    {
        public UpdateFileCategoryCommandValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("{Name} is required.")
                .NotNull()
                .MaximumLength(150).WithMessage("{Name} must not exceed 150 characters.");

            RuleFor(p => p.Description)
                .MaximumLength(5000).WithMessage("{Description} must not exceed 5000 characters.");
        }
    }
}