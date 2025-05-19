using FluentValidation;

namespace CleanArchFramework.Application.Features.Order.Commands.CreateOrder
{
    internal class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
    {
        public CreateOrderCommandValidator()
        {
            RuleFor(p => p.OrderedItems)
                .NotEmpty().NotNull().WithMessage("Order Items are required!");

            RuleFor(p => p.Email)
                .NotEmpty().NotNull().EmailAddress();

        }
    }
}
