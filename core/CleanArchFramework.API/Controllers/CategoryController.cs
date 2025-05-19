using CleanArchFramework.Application.Features.Category.Command.CreateCategory;
using CleanArchFramework.Application.Features.Category.Command.DeleteCategory;
using CleanArchFramework.Application.Features.Category.Command.UpdateCategory;
using CleanArchFramework.Application.Features.Category.Query.GetAllCategory;
using CleanArchFramework.Application.Features.Category.Query.GetCategory;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchFramework.API.Controllers
{
    [Route("api/")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CategoryController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("category")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<CreateCategoryCommand>> AddCategory([FromForm] CreateCategoryCommand createCategoryCommand)
        {
            var response = await _mediator.Send(createCategoryCommand);
            return Ok(response);
        }
        [HttpPut("category")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<UpdateCategoryCommand>> UpdateCategory([FromForm] UpdateCategoryCommand updateCategoryCategoryCommand)
        {
            var response = await _mediator.Send(updateCategoryCategoryCommand);
            return Ok(response);
        }
        [HttpGet("category")]
        public async Task<ActionResult<PagedResult<GetAllCategoryDto>>> GetAllCategory([FromQuery] GetAllCategoryQuery getAllCategoryQuery)
        {
            var response = await _mediator.Send(getAllCategoryQuery);
            return Ok(response);
        }
        [HttpGet("category/{id}")]
        public async Task<ActionResult<Result<GetCategoryDto>>> GetCategoryById(int id)
        {
            var response = await _mediator.Send(new GetCategoryQuery { Id = id });
            return Ok(response);
        }
        [HttpDelete("category/{id}")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<Result<DeleteCategoryDto>>> DeleteCategoryById(int id)
        {
            var response = await _mediator.Send(new DeleteCategoryCommand() { Id = id });
            return Ok(response);
        }
    }
}
