using FluentValidation;

namespace CleanArchFramework.Application.Features.ProductCategory.Command.CreateProductCategory
{
    internal class CreateProductCategoryCommandValidator : AbstractValidator<CreateProductCategoryCommand>
    {
        public CreateProductCategoryCommandValidator()
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
