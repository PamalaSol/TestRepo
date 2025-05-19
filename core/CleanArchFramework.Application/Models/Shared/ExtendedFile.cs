using Microsoft.AspNetCore.Http;

namespace CleanArchFramework.Application.Models.Shared
{
    public class ExtendedFile
    {
        public IFormFile? File { get; set; }
        public string? Alt { get; set; }
        public int? Category { get; set; }
        public string? Title { get; set; }
    }
}
