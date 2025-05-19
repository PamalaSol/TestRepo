using FluentValidation;

namespace CleanArchFramework.Application.Features.FileCategory.Command.DeleteFileCategory
{
    public class DeleteFileCategoryCommandValidator : AbstractValidator<DeleteFileCategoryCommand>
    {
        public DeleteFileCategoryCommandValidator()
        {
            RuleFor(p => p.Id)
                .NotEmpty().WithMessage("{Id} is required.")
                .NotNull();
        }
    }
}
