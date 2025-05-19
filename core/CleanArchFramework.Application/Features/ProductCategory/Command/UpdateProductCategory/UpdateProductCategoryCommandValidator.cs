using FluentValidation;

namespace CleanArchFramework.Application.Features.ProductCategory.Command.UpdateProductCategory
{
    public class UpdateProductCategoryCommandValidator : AbstractValidator<UpdateProductCategoryCommand>
    {
        public UpdateProductCategoryCommandValidator()
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