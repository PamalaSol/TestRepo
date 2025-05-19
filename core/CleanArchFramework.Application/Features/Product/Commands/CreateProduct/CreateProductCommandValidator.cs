using FluentValidation;

namespace CleanArchFramework.Application.Features.Product.Commands.CreateProduct
{
    internal class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
    {
        public CreateProductCommandValidator()
        {
            RuleFor(p => p.Heading)
                .NotEmpty().WithMessage("{Heading} is required.")
                .NotNull()
                .MaximumLength(5000).WithMessage("{Heading} must not exceed 5000 characters.");

            //RuleFor(p => p.Content)
            //    .NotEmpty().WithMessage("{Content} is required.")
            //    .NotNull()
            //    .MaximumLength(5000000).WithMessage("{Content} must not exceed 5000000 characters.");


        }
    }
}
