using MediatR;

namespace CleanArchFramework.Application.Features.Faq.Commands.CreateFaq
{
    public class CreateFaqCommand : IRequest<CreateFaqCommandResponse>
    {
        public required string Question { get; set; }
        public required string Answer { get; set; }
        public string? LinkTo { get; set; }
        public bool IsPublished { get; set; }
        public bool IsPromoted { get; set; }
  
    }
}
