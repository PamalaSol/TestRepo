using CleanArchFramework.Application.Features.Product.Commands.CreateProduct;
using CleanArchFramework.Application.Features.Product.Commands.DeleteProduct;
using CleanArchFramework.Application.Features.Product.Commands.UpdateProduct;
using CleanArchFramework.Application.Features.Product.Query.GetAllProduct;
using CleanArchFramework.Application.Features.Product.Query.GetProduct;
using CleanArchFramework.Application.Features.Product.Query.GetProductByCategory;
using CleanArchFramework.Application.Features.Product.Query.GetProductsByCategory;
using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchFramework.API.Controllers;

[Route("api/")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("Product")]
    [Consumes("multipart/form-data")]
    [Authorize(Roles = "Superadmin,Admin")]
    public async Task<ActionResult<CreateProductCommand>> AddProduct([FromForm] CreateProductCommand updateProductCommand)
    {
        var response = await _mediator.Send(updateProductCommand);
        return Ok(response);
    }

    [Consumes("multipart/form-data")]
    [HttpPut("Product")]
    [Authorize(Roles = "Superadmin,Admin")]
    public async Task<ActionResult<UpdateProductCommand>> UpdateProduct([FromForm] UpdateProductCommand updateProductCommand)
    {
        var response = await _mediator.Send(updateProductCommand);
        return Ok(response);
    }

    [HttpGet("GetProduct/{id}")]
    public async Task<ActionResult<PagedResult<GetProductDto>>> GetProduct(Guid id)
    {
        var response = await _mediator.Send(new GetProductQuery { Id = id });
        return Ok(response);
    }

    [HttpGet("product/{category}/{productId}")]
    [HttpGet("produkt/{category}/{productId}")]
    [HttpGet("produit/{category}/{productId}")]

    [HttpGet("products/{categoryName}/{category}/{productName}/{productId}")]
    [HttpGet("produkte/{categoryName}/{category}/{productName}/{productId}")]
    [HttpGet("produits/{categoryName}/{category}/{productName}/{productId}")]
    [HttpGet("produits/{categoryName}_{category}/{productName}_{productId}")]
    public async Task<ActionResult<PagedResult<GetProductDto>>> GetProductByCategory(int category, Guid productId)
    {
        var response = await _mediator.Send(new GetProductByCategoryQuery() { Id = productId, CategoryId = category });
        return Ok(response);
    }

    [HttpGet("Products")]
    public async Task<ActionResult<PagedResult<GetProductDto>>> GetAllProduct([FromQuery] GetAllProductQuery getAllProduct)
    {
        var response = await _mediator.Send(getAllProduct);
        return Ok(response);
    }

    [HttpGet("products/{category}")]
    [HttpGet("produkte/{category}")]
    [HttpGet("produits/{category}")]
    public async Task<ActionResult<PagedResult<GetProductDto>>> GetProductsByCategory([FromQuery] QueryOptions queryOptions, int category,
        [FromQuery] string? size,
        [FromQuery] string? connection,
        [FromQuery] string? housingMaterial,
        [FromQuery] string? sleeveQuality)
    {
        GetProductsByCategoryQuery getAllProductByCategory = new GetProductsByCategoryQuery
        { ProductCategory = category, QueryOptions = queryOptions, Connection = connection, HousingMaterial = housingMaterial, Size = size, SleeveQuality = sleeveQuality };
        getAllProductByCategory.ProductCategory = category;
        var response = await _mediator.Send(getAllProductByCategory);
        return Ok(response);
    }
    [HttpGet("products/{categoryName}/{category}")]
    [HttpGet("produkte/{categoryName}/{category}")]
    [HttpGet("produits/{categoryName}/{category}")]
    public async Task<ActionResult<PagedResult<GetProductDto>>> GetProductsByCategoryAndName([FromQuery] QueryOptions queryOptions, int category, string categoryName,
        [FromQuery] string? size,
        [FromQuery] string? connection,
        [FromQuery] string? housingMaterial,
        [FromQuery] string? sleeveQuality
    )
    {
        GetProductsByCategoryQuery getAllProductByCategory = new GetProductsByCategoryQuery
        { ProductCategory = category, QueryOptions = queryOptions, Connection = connection, HousingMaterial = housingMaterial, Size = size, SleeveQuality = sleeveQuality };
        getAllProductByCategory.ProductCategory = category;
        var response = await _mediator.Send(getAllProductByCategory);
        return Ok(response);
    }
    [HttpDelete("Product/{id}")]
    [Authorize(Roles = "Superadmin,Admin")]
    public async Task<ActionResult<Result<DeleteProductCommand>>> DeleteProductById(Guid id)
    {
        var response = await _mediator.Send(new DeleteProductCommand() { Id = id });
        return Ok(response);
    }
}