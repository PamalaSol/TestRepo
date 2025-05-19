using CleanArchFramework.Application.Features.SiteSettings.Commands.CreateSiteSettings;
using CleanArchFramework.Application.Features.SiteSettings.Commands.DeleteSiteSettings;
using CleanArchFramework.Application.Features.SiteSettings.Commands.UpdateSiteSettings;
using CleanArchFramework.Application.Features.SiteSettings.Query.GetSiteSettings;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchFramework.API.Controllers
{
    [Route("api/")]
    [ApiController]
    public class SiteSettingsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SiteSettingsController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost("SiteSettings")]
        [Authorize(Roles = "Superadmin")]
        public async Task<ActionResult<CreateSiteSettingsCommand>> AddSiteSettings([FromBody] CreateSiteSettingsCommand createSiteSettingsCommand)
        {
            var response = await _mediator.Send(createSiteSettingsCommand);
            return Ok(response);
        }

        [HttpPut("SiteSettings")]
        [Authorize(Roles = "Superadmin")]
        public async Task<ActionResult<UpdateSiteSettingsCommand>> UpdateSiteSettings([FromBody] UpdateSiteSettingsCommand updateSiteSettingsSiteSettingsCommand)
        {
            var response = await _mediator.Send(updateSiteSettingsSiteSettingsCommand);
            return Ok(response);
        }


        [HttpGet("SiteSettings")]
        public async Task<ActionResult<Result<GetSiteSettingsDto>>> GetSiteSettingsById()
        {
            var response = await _mediator.Send(new GetSiteSettingsQuery { });
            return Ok(response);
        }

        [HttpDelete("SiteSettings/{id}")]
        [Authorize(Roles = "Superadmin")]
        public async Task<ActionResult<Result<DeleteSiteSettingsDto>>> DeleteSiteSettingsById(int id)
        {
            var response = await _mediator.Send(new DeleteSiteSettingsCommand() { Id = id });
            return Ok(response);
        }
    }
}
