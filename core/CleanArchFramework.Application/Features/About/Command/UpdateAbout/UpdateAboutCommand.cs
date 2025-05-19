using MediatR;
using Microsoft.AspNetCore.Http;

namespace CleanArchFramework.Application.Features.About.Command.UpdateAbout
{
    public class UpdateAboutCommand : IRequest<UpdateAboutCommandResponse>
    {
        public int Id { get; set; }
        public IFormFile? Image { get; set; }
        public string? Alt { get; set; }
        //public IFormFile? BackgroundImage { get; set; }
        public string? Title { get; set; }
        public string? Subtitle { get; set; }
        public string? InfoText { get; set; }


    }

}
