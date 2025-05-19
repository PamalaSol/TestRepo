//using CleanArchFramework.Application.Features.Menu.Commands.CreateMenu;
//using CleanArchFramework.Application.Features.Menu.Commands.DeleteMenu;
//using CleanArchFramework.Application.Features.Menu.Commands.UpdateMenu;
//using CleanArchFramework.Application.Features.Menu.Query.GetAllMenus;
//using CleanArchFramework.Application.Features.Menu.Query.GetMenu;
//using CleanArchFramework.Application.Shared.Result;
//using MediatR;
//using Microsoft.AspNetCore.Mvc;



//namespace CleanArchFramework.API.Controllers
//{
//    [Route("api/")]
//    [ApiController]
//    public class MenuController : ControllerBase
//    {
//        private readonly IMediator _mediator;

//        public MenuController(IMediator mediator)
//        {
//            _mediator = mediator;
//        }

//        [HttpPost("menu")]
//        public async Task<ActionResult<CreateMenuCommand>> AddMenu([FromBody] CreateMenuCommand createMenuCommand)
//        {
//            var response = await _mediator.Send(createMenuCommand);
//            return Ok(response);
//        }
//        [HttpPut("menu")]
//        public async Task<ActionResult<UpdateMenuCommand>> UpdateMenu([FromBody] UpdateMenuCommand updateMenuMenuCommand)
//        {
//            var response = await _mediator.Send(updateMenuMenuCommand);
//            return Ok(response);
//        }
//        [HttpGet("menu")]
//        public async Task<ActionResult<PagedResult<GetAllMenuDto>>> GetAllMenu([FromQuery] GetAllMenuQuery getAllMenuQuery)
//        {
//            var response = await _mediator.Send(getAllMenuQuery);
//            return Ok(response);
//        }
//        [HttpGet("menu/{id}")]
//        public async Task<ActionResult<Result<GetMenuDto>>> GetMenuById(Guid id)
//        {
//            var response = await _mediator.Send(new GetMenuQuery { Id = id });
//            return Ok(response);
//        }
//        [HttpDelete("menu/{id}")]
//        public async Task<ActionResult<Result<DeleteMenuDto>>> DeleteMenuById(Guid id)
//        {
//            var response = await _mediator.Send(new DeleteMenuCommand() { Id = id });
//            return Ok(response);
//        }
//    }
//}
