using MediatR;

namespace CleanArchFramework.Application.Features.Tag.Commands.UpdateTag
{
    public class UpdateTagCommand : IRequest<UpdateTagCommandResponse>
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }

    }

}
