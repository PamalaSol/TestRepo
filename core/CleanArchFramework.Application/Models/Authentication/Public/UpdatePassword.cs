namespace CleanArchFramework.Application.Models.Authentication.Public
{
    public class UpdatePassword
    {
   
        public required string OldPassword { get; set; }
        public required string Password { get; set; }
        public required string ConfirmPassword { get; set; }
    }
}
