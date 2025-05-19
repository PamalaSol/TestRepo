using Microsoft.AspNetCore.Http;

namespace CleanArchFramework.Application.Models.Authentication.Public
{
    public class UpdateUserBase
    {
        public required string Name { get; set; }
        public required string LastName { get; set; }
        public IFormFile? ProfilePictureFile { get; set; }
        public string? Social { get; set; }
        public string? Website { get; set; }
        public string? Info { get; set; }
        //public IFormFile? ProfileBackgroundFile { get; set; }
       

    }
}
