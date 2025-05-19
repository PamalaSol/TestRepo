namespace CleanArchFramework.Application.Models.Authentication
{
    public sealed class ResetPassword
    {
        public required string Password { get; set; }
        public required string ConfirmPassword { get; set; }
    }
}
