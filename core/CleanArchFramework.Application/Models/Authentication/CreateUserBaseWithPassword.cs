namespace CleanArchFramework.Application.Models.Authentication
{
    public class CreateUserWithPassword : CreateUserBase
    {
        public required string Password { get; set; }
        public required string ConfirmPassword { get; set; }
    }
}
