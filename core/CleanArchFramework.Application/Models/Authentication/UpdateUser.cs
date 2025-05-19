using CleanArchFramework.Application.Models.Authentication.Public;

namespace CleanArchFramework.Application.Models.Authentication
{
    public class UpdateUser : UpdateUserBase
    {
        public required string? Email { get; set; }
        public required string Password { get; set; }
        public required string ConfirmPassword { get; set; }
        public bool? IsActive { get; set; }
    }
}
