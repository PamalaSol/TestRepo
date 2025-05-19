using Microsoft.AspNetCore.Http;

namespace CleanArchFramework.Application.Contracts.Identity
{
    public interface IAuthorizationService
    {
        bool CheckUserToUser(HttpContext context, string userId);
    }
}
