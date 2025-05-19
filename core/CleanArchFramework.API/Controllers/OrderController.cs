using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Application.Features.Order.Commands.CreateOrder;
using CleanArchFramework.Application.Features.Order.Commands.DeleteOrder;
using CleanArchFramework.Application.Features.Order.Commands.UpdateOrder;
using CleanArchFramework.Application.Features.Order.Query.GetAllOrder;
using CleanArchFramework.Application.Features.Order.Query.GetOrder;
using CleanArchFramework.Application.Models.Infrastructure;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchFramework.API.Controllers
{

    [Route("api/")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IMediator _mediator;
        private IGoogleRecaptchaV3Service _GService { get; set; }
        public OrderController(IMediator mediator, IGoogleRecaptchaV3Service gService)
        {
            _mediator = mediator;
            _GService = gService;
        }

        [HttpPost("Order")]
        public async Task<ActionResult<CreateOrderCommand>> AddOrder([FromBody] CreateOrderCommand createOrderCommand, [FromQuery] string captchaToken)
        {
            GRequestModel rm = new GRequestModel(captchaToken, HttpContext.Connection.RemoteIpAddress.ToString(), "", "");

            _GService.InitializeRequest(rm);

            if (!await _GService.Execute())
            {
                return BadRequest(_GService.Response.error_codes);
            }
            var response = await _mediator.Send(createOrderCommand);
            return Ok(response);
        }
        [HttpPut("Order")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<UpdateOrderCommand>> UpdateOrder([FromBody] UpdateOrderCommand updateOrderOrderCommand)
        {
            var response = await _mediator.Send(updateOrderOrderCommand);
            return Ok(response);
        }
        [HttpGet("Order")]
        [Authorize(Roles = "Superadmin,Admin")] //User
        public async Task<ActionResult<PagedResult<GetAllOrderDto>>> GetAllOrder([FromQuery] GetAllOrderQuery getAllOrderQuery)
        {
            var response = await _mediator.Send(getAllOrderQuery);
            return Ok(response);
        }
        [HttpGet("Order/{id}")]
        [Authorize(Roles = "Superadmin,Admin")] //User
        public async Task<ActionResult<Result<GetOrderDto>>> GetOrderById(Guid id)
        {
            var response = await _mediator.Send(new GetOrderQuery { Id = id });
            return Ok(response);
        }
        [HttpDelete("Order/{id}")]
        [Authorize(Roles = "Superadmin")]
        public async Task<ActionResult<Result<DeleteOrderDto>>> DeleteOrderById(Guid id)
        {
            var response = await _mediator.Send(new DeleteOrderCommand() { Id = id });
            return Ok(response);
        }
    }
}
