using FluentValidation;

namespace CleanArchFramework.Application.Features.Posts.Commands.DeletePost
{
    public class PostCommandValidator : AbstractValidator<DeletePostCommand>
    {
        public PostCommandValidator()
        {
            RuleFor(p => p.Id)
                .NotEmpty().WithMessage("{Id} is required.")
                .NotNull();
        }
    }
}
