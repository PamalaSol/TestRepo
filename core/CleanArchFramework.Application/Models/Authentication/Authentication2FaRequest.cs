namespace CleanArchFramework.Application.Models.Authentication
{
    public class Authentication2FaRequest
    {
        public string? Code { get; set; }
        public bool IsPersisted { get; set; }
        public bool RememberClient { get; set; }
    }
}
