using CleanArchFramework.Application.Features.ProductCategory.Command.CreateProductCategory;
using CleanArchFramework.Application.Features.ProductCategory.Command.DeleteProductCategory;
using CleanArchFramework.Application.Features.ProductCategory.Command.UpdateProductCategory;
using CleanArchFramework.Application.Features.ProductCategory.Query.GetAllProductCategory;
using CleanArchFramework.Application.Features.ProductCategory.Query.GetProductCategory;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchFramework.API.Controllers
{
    [Route("api/")]
    [ApiController]
    public class ProductCategoryController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProductCategoryController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("productCategory")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<CreateProductCategoryDto>> AddCategory([FromForm] CreateProductCategoryCommand createCategoryCommand)
        {
            var response = await _mediator.Send(createCategoryCommand);
            return Ok(response);
        }
        [HttpPut("productCategory")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<UpdateProductCategoryDto>> UpdateCategory([FromForm] UpdateProductCategoryCommand updateCategoryCategoryCommand)
        {
            var response = await _mediator.Send(updateCategoryCategoryCommand);
            return Ok(response);
        }
      
        [HttpGet("productCategory")]
        public async Task<ActionResult<PagedResult<GetAllProductCategoryDto>>> GetAllCategory([FromQuery] GetAllProductCategoryQuery getAllCategoryQuery)
        {
            var response = await _mediator.Send(getAllCategoryQuery);
            return Ok(response);
        }
        [HttpGet("productCategory/{id}")]
        public async Task<ActionResult<Result<GetProductCategoryDto>>> GetCategoryById(int id)
        {
            var response = await _mediator.Send(new GetProductCategoryQuery { Id = id });
            return Ok(response);
        }
        [HttpDelete("productCategory/{id}")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<Result<DeleteProductCategoryDto>>> DeleteCategoryById(int id)
        {
            var response = await _mediator.Send(new DeleteProductCategoryCommand() { Id = id });
            return Ok(response);
        }
    }
}
