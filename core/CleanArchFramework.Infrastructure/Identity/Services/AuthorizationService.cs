using CleanArchFramework.Domain.Entities;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Text.Encodings.Web;
using CleanArchFramework.Application.Contracts.Identity;
using Microsoft.AspNetCore.Http;

namespace CleanArchFramework.Infrastructure.Identity.Services
{
    public class AuthorizationService : IAuthorizationService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ILogger<AuthorizationService> _logger;
        private readonly IMediator _mediator;

        public AuthorizationService(
            UserManager<ApplicationUser> userManager,
            IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
            IMapper mapper,
            ILogger<AuthorizationService> logger,
            UrlEncoder urlEncoder, IMediator mediator) {
            _userManager = userManager;
            _mapper = mapper;
            _logger = logger;
            _mediator = mediator;
        }
  
        /// <summary>
        /// Check if this user belongs to the logged in users!
        /// </summary>
        /// <param name="context"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public bool CheckUserToUser(HttpContext context, string userId)
        {
            var tokenUserId = context.User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;

            if (tokenUserId == userId)
            {
                return true;
            };

            return false;
        }
    }
}
