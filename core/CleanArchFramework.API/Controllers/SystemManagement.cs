using CleanArchFramework.Application.Contracts.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchFramework.API.Controllers;

[Route("api/")]
[ApiController]
public class SystemManagementController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUtilityService _utilityService;

    public SystemManagementController(IMediator mediator, IUtilityService utilityService)
    {
        _mediator = mediator;
        _utilityService = utilityService;
    }


  
    [HttpGet("RemoveAllUnusedLocalizationSets")]
    [Authorize(Roles = "Superadmin")]
    public async Task<ActionResult<bool>> RemoveAllUnusedLocalizationSets()
    {
        var response = await _utilityService.RemoveAllUnusedLocalizationSets();
        return Ok(response);
    }
    [HttpGet("RemoveAllUnusedFileSets")]
    [Authorize(Roles = "Superadmin")]
    public async Task<ActionResult<bool>> RemoveAllUnusedFileSets()
    {
        var response = await _utilityService.RemoveAllUnusedFileSets();
        return Ok(response);
    }
 
}