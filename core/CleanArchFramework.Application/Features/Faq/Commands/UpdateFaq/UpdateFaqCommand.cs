using MediatR;

namespace CleanArchFramework.Application.Features.Faq.Commands.UpdateFaq
{
    public class UpdateFaqCommand : IRequest<UpdateFaqCommandResponse>
    {
        public int Id { get; set; }
        public required string Question { get; set; }
        public required string Answer { get; set; }
        public string? LinkTo { get; set; }
        public bool IsPublished { get; set; }
        public bool IsPromoted { get; set; }


    }

}
