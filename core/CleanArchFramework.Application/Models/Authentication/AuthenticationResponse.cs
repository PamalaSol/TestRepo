namespace CleanArchFramework.Application.Models.Authentication
{
    public class AuthenticationResponse
    {
        public string? AccessToken { get; set; }
        public User? User { get; set; }
        public bool Success { get; set; }
        public bool Requires2Fa { get; set; }
        public bool IsLockedOut { get; set; }
        public bool IsNotAllowed { get; set; }
    }
}
