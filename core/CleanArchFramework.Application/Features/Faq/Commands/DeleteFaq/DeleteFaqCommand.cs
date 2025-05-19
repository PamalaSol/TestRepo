using MediatR;

namespace CleanArchFramework.Application.Features.Faq.Commands.DeleteFaq
{
    public class DeleteFaqCommand : IRequest<DeleteFaqCommandResponse>
    {
        public int Id { get; set; }

    }
    
}
