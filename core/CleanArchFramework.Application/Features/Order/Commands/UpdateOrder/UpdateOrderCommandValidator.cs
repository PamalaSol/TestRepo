using FluentValidation;

namespace CleanArchFramework.Application.Features.Order.Commands.UpdateOrder
{
    public class UpdateOrderCommandValidator : AbstractValidator<UpdateOrderCommand>
    {
        public UpdateOrderCommandValidator()
        {
            RuleFor(p => p.OrderStatusId)
                .NotEmpty().WithMessage("{OrderStatusId} is required.")
                .NotNull();

 
        }
    }
}