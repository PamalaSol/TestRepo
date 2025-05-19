using FluentValidation;

namespace CleanArchFramework.Application.Features.Posts.Commands.UpdatePost
{
    public class UpdatePostCommandValidator : AbstractValidator<UpdatePostCommand>
    {
        public UpdatePostCommandValidator()
        {
            RuleFor(p => p.Id)
                .NotEmpty()
                .NotNull();
 
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("{Name} is required.")
                .NotNull()
                .MaximumLength(150).WithMessage("{Name} must not exceed 150 characters.");

            RuleFor(p => p.Content)
                .NotEmpty().WithMessage("{Content} is required.")
                .NotNull()
                .MaximumLength(5000000).WithMessage("{Content} must not exceed 5000000 characters.");
        }
    }
}