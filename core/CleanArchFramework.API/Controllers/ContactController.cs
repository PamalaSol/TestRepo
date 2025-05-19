using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Application.Features.Contact.Command;
using CleanArchFramework.Application.Models.Infrastructure;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchFramework.API.Controllers
{
    [Route("api/")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IMediator _mediator;
        IGoogleRecaptchaV3Service _gService { get; set; }
        public ContactController(IMediator mediator, IGoogleRecaptchaV3Service gService)
        {
            _mediator = mediator;
            _gService = gService;
        }
        [HttpPost("contact")]
        public async Task<ActionResult<Result>> ContactForm([FromBody] ContactForm createForm, [FromQuery] string captchaToken)
        {
            GRequestModel rm = new GRequestModel(captchaToken, HttpContext.Connection.RemoteIpAddress.ToString(),"","");

            _gService.InitializeRequest(rm);

            if (!await _gService.Execute())
            {
                //return error codes string.
                return BadRequest(_gService.Response.error_codes);
            }
            var response = await _mediator.Send(createForm);
            return Ok(response);
        }
    }
}
