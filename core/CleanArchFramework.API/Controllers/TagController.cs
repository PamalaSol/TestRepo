//using CleanArchFramework.Application.Features.Tag.Commands.CreateTag;
//using CleanArchFramework.Application.Features.Tag.Commands.DeleteTag;
//using CleanArchFramework.Application.Features.Tag.Commands.UpdateTag;
//using CleanArchFramework.Application.Features.Tag.Query.GetAllTag;
//using CleanArchFramework.Application.Features.Tag.Query.GetTag;
//using CleanArchFramework.Application.Shared.Result;
//using MediatR;
//using Microsoft.AspNetCore.Mvc;

//namespace CleanArchFramework.API.Controllers
//{
//    [Route("api/")]
//    [ApiController]
//    public class TagController : ControllerBase
//    {
//        private readonly IMediator _mediator;

//        public TagController(IMediator mediator)
//        {
//            _mediator = mediator;
//        }

//        [HttpPost("Tag")]
//        public async Task<ActionResult<CreateTagCommand>> AddTag([FromBody] CreateTagCommand createTagCommand)
//        {
//            var response = await _mediator.Send(createTagCommand);
//            return Ok(response);
//        }

//        [HttpPut("Tag")]
//        public async Task<ActionResult<UpdateTagCommand>> UpdateTag([FromBody] UpdateTagCommand updateTagTagCommand)
//        {
//            var response = await _mediator.Send(updateTagTagCommand);
//            return Ok(response);
//        }

//        [HttpGet("Tag")]
//        public async Task<ActionResult<PagedResult<GetAllTagDto>>> GetAllTag([FromQuery] GetAllTagQuery getAllTagQuery)
//        {
//            var response = await _mediator.Send(getAllTagQuery);
//            return Ok(response);
//        }

//        [HttpGet("Tag/{id}")]
//        public async Task<ActionResult<Result<GetTagDto>>> GetTagById(int id)
//        {
//            var response = await _mediator.Send(new GetTagQuery { Id = id });
//            return Ok(response);
//        }

//        [HttpDelete("Tag/{id}")]
//        public async Task<ActionResult<Result<DeleteTagDto>>> DeleteTagById(int id)
//        {
//            var response = await _mediator.Send(new DeleteTagCommand() { Id = id });
//            return Ok(response);
//        }
//    }
//}

