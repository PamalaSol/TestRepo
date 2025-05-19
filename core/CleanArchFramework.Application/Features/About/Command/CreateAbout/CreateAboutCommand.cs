using MediatR;
using Microsoft.AspNetCore.Http;

namespace CleanArchFramework.Application.Features.About.Command.CreateAbout
{
    public class CreateAboutCommand : IRequest<CreateAboutCommandResponse>
    {
        public IFormFile? Image { get; set; }
        public string? Alt { get; set; }
        public int? FileCategory { get; set; }
        //public IFormFile? BackgroundImage { get; set; }
        //public string? Alt { get; set; }
        public string? Title { get; set; }
        public string? Subtitle { get; set; }
        public string? InfoText { get; set; }


    }
}
