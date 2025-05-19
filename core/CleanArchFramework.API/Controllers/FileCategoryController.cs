using CleanArchFramework.Application.Features.FileCategory.Command.CreateFileCategory;
using CleanArchFramework.Application.Features.FileCategory.Command.DeleteFileCategory;
using CleanArchFramework.Application.Features.FileCategory.Command.UpdateFileCategory;
using CleanArchFramework.Application.Features.FileCategory.Query.GetAllFileCategory;
using CleanArchFramework.Application.Features.FileCategory.Query.GetFileCategory;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchFramework.API.Controllers
{
    [Route("api/")]
    [ApiController]
    public class FileCategoryController : ControllerBase
    {
        private readonly IMediator _mediator;

        public FileCategoryController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("fileCategory")]
        [Authorize(Roles = "Superadmin")]
        public async Task<ActionResult<CreateFileCategoryDto>> AddCategory([FromForm] CreateFileCategoryCommand createCategoryCommand)
        {
            var response = await _mediator.Send(createCategoryCommand);
            return Ok(response);
        }
        [HttpPut("fileCategory")]
        [Authorize(Roles = "Superadmin")]
        public async Task<ActionResult<UpdateFileCategoryDto>> UpdateCategory([FromForm] UpdateFileCategoryCommand updateCategoryCategoryCommand)
        {
            var response = await _mediator.Send(updateCategoryCategoryCommand);
            return Ok(response);
        }
        [HttpGet("fileCategory")]
        public async Task<ActionResult<PagedResult<GetAllFileCategoryDto>>> GetAllCategory([FromQuery] GetAllFileCategoryQuery getAllCategoryQuery)
        {
            var response = await _mediator.Send(getAllCategoryQuery);
            return Ok(response);
        }
        [HttpGet("fileCategory/{id}")]
        public async Task<ActionResult<Result<GetFileCategoryDto>>> GetCategoryById(int id)
        {
            var response = await _mediator.Send(new GetFileCategoryQuery { Id = id });
            return Ok(response);
        }
        [HttpDelete("fileCategory/{id}")]
        [Authorize(Roles = "Superadmin")]
        public async Task<ActionResult<Result<DeleteFileCategoryDto>>> DeleteCategoryById(int id)
        {
            var response = await _mediator.Send(new DeleteFileCategoryCommand() { Id = id });
            return Ok(response);
        }
    }
}
