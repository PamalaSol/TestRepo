using CleanArchFramework.Application.Models.Authentication.Public;

namespace CleanArchFramework.Application.Models.Authentication
{
    public class GetUser : PublicUser
    {
        public required string? Email { get; set; }
        public bool IsActive { get; set; }
        public List<string?>? Roles { get; set; } = new List<string>();
    }
}
