
using CleanArchFramework.Application.Features.Posts.Commands.CreatePost;
using CleanArchFramework.Application.Features.Posts.Commands.DeletePost;
using CleanArchFramework.Application.Features.Posts.Commands.UpdatePost;
using CleanArchFramework.Application.Features.Posts.Query.GetAllPost;
using CleanArchFramework.Application.Features.Posts.Query.GetPost;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchFramework.API.Controllers
{
    [Route("api/")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PostController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost("Post")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<CreatePostCommand>> AddPost([FromForm] CreatePostCommand createPostCommand)
        {
            var response = await _mediator.Send(createPostCommand);
            return Ok(response);
        }

        [HttpPut("Post")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<UpdatePostCommand>> UpdatePost([FromForm] UpdatePostCommand updatePostPostCommand)
        {
            var response = await _mediator.Send(updatePostPostCommand);
            return Ok(response);
        }

        [HttpGet("Post")]
        public async Task<ActionResult<PagedResult<GetAllPostDto>>> GetAllPost([FromQuery] GetAllPostQuery getAllPostQuery)
        {
            var response = await _mediator.Send(getAllPostQuery);
            return Ok(response);
        }

        [HttpGet("Post/{id}")]
        public async Task<ActionResult<Result<GetPostDto>>> GetPostById(Guid id)
        {
            var response = await _mediator.Send(new GetPostQuery { Id = id });
            return Ok(response);
        }

        [HttpDelete("Post/{id}")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<Result<DeletePostDto>>> DeletePostById(Guid id)
        {
            var response = await _mediator.Send(new DeletePostCommand() { Id = id });
            return Ok(response);
        }
    }
}
