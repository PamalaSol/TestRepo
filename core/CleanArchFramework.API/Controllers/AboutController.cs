using CleanArchFramework.Application.Features.About.Command.CreateAbout;
using CleanArchFramework.Application.Features.About.Command.DeleteAbout;
using CleanArchFramework.Application.Features.About.Command.UpdateAbout;
using CleanArchFramework.Application.Features.About.Query.GetAbout;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchFramework.API.Controllers
{
    [Route("api/")]
    [ApiController]
    public class AboutController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AboutController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("About")]
        [Authorize(Roles= "Superadmin")]
        public async Task<ActionResult<CreateAboutCommand>> AddAbout([FromForm] CreateAboutCommand createAboutCommand)
        {
            var response = await _mediator.Send(createAboutCommand);
            return Ok(response);
        }

        [HttpPut("About")]
        [Authorize(Roles = "Superadmin")]
        public async Task<ActionResult<UpdateAboutCommand>> UpdateAbout([FromForm] UpdateAboutCommand updateAboutAboutCommand)
        {
            var response = await _mediator.Send(updateAboutAboutCommand);
            return Ok(response);
        }

        [HttpGet("About")]
        public async Task<ActionResult<PagedResult<GetAboutDto>>> GetAbout()
        {
            var response = await _mediator.Send(new GetAboutQuery());
            return Ok(response);
        }


        [HttpDelete("About/{id}")]
        [Authorize(Roles = "Superadmin")]
        public async Task<ActionResult<Result<DeleteAboutDto>>> DeleteAboutById(int id)
        {
            var response = await _mediator.Send(new DeleteAboutCommand() { Id = id });
            return Ok(response);
        }
    }
}
