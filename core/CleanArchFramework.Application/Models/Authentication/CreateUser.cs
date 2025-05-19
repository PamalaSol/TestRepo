namespace CleanArchFramework.Application.Models.Authentication
{
    public sealed class CreateUser : CreateUserWithPassword
    {
        /// <summary>
        /// The user's name
        /// </summary>

        public List<string> Roles { get; set; }

    }
}
