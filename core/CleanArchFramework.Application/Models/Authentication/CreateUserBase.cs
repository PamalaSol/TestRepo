using CleanArchFramework.Application.Models.Authentication.Public;
using CleanArchFramework.Application.Shared.Result;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CleanArchFramework.Application.Models.Authentication
{
    public class CreateUserBase : IRequest<Result<PublicUser>>
    {
        /// <summary>
        /// The user's name
        /// </summary>
        public required string Name { get; set; }

        /// <summary>
        /// The user's LastName
        /// </summary>
        public required string LastName { get; set; }

        public required string? Email { get; set; }
        /// <summary>
        /// The user's profile picture resource id
        /// </summary> 
        public IFormFile? ProfilePictureFile { get; set; }
        public string? Social { get; set; }
        public string? Website { get; set; }
        public string? Info { get; set; } 
        //Main Description
                                          
        //  public IFormFile? ProfileBackgroundFile { get; set; }

    }
}
