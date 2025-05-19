using CleanArchFramework.Application.Features.Faq.Commands.CreateFaq;
using CleanArchFramework.Application.Features.Faq.Commands.DeleteFaq;
using CleanArchFramework.Application.Features.Faq.Commands.UpdateFaq;
using CleanArchFramework.Application.Features.Faq.Query.GetAllFaq;
using CleanArchFramework.Application.Features.Faq.Query.GetFaq;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchFramework.API.Controllers
{
    [Route("api/")]
    [ApiController]
    public class FaqController : ControllerBase
    {
        private readonly IMediator _mediator;

        public FaqController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("Faq")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<CreateFaqCommand>> AddFaq([FromBody] CreateFaqCommand createFaqCommand)
        {
            var response = await _mediator.Send(createFaqCommand);
            return Ok(response);
        }
        [HttpPut("Faq")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<UpdateFaqCommand>> UpdateFaq([FromBody] UpdateFaqCommand updateFaqFaqCommand)
        {
            var response = await _mediator.Send(updateFaqFaqCommand);
            return Ok(response);
        }
        [HttpGet("Faq")]
        public async Task<ActionResult<PagedResult<GetAllFaqDto>>> GetAllFaq([FromQuery] GetAllFaqQuery getAllFaqQuery)
        {
            var response = await _mediator.Send(getAllFaqQuery);
            return Ok(response);
        }
        [HttpGet("Faq/{id}")]
        public async Task<ActionResult<Result<GetFaqDto>>> GetFaqById(int id)
        {
            var response = await _mediator.Send(new GetFaqQuery { Id = id });
            return Ok(response);
        }
        [HttpDelete("Faq/{id}")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<Result<DeleteFaqDto>>> DeleteFaqById(int id)
        {
            var response = await _mediator.Send(new DeleteFaqCommand() { Id = id });
            return Ok(response);
        }
    }
}
