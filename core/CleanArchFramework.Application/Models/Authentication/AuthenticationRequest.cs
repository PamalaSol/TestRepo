namespace CleanArchFramework.Application.Models.Authentication
{
    public class AuthenticationRequest
    {
        public string Email { get; set; }

        public string Password { get; set; }

        public bool? RememberMe { get; set; }
    }
}
