using MediatR;

namespace CleanArchFramework.Application.Features.Tag.Commands.CreateTag
{
    public class CreateTagCommand : IRequest<CreateTagCommandResponse>
    {
        public required string Name { get; set; }
        public string? Description { get; set; }

    }
}
