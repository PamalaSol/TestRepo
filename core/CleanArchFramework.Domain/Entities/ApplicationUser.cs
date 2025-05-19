using CleanArchFramework.Domain.Common;
using Microsoft.AspNetCore.Identity;


namespace CleanArchFramework.Domain.Entities
{
    public class ApplicationUser : IdentityUser, IAuditableEntity
    {

        /// <summary>
        /// The user's name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The user's LastName
        /// </summary>
        public string LastName { get; set; }

        public Guid? ProfilePictureId { get; set; }

        /// <summary>
        /// The user's profile picture resource id
        /// </summary> 
        public FileStorage ProfilePicture { get; set; }

        /// <summary>
        /// Flag indicating whether user is active
        /// </summary>
        public bool IsActive { get; set; } = false;

        /// <summary>
        /// Flag indicating that user must change his password
        /// </summary>
        public bool MustChangePassword { get; set; } = false;

        /// <summary>
        /// The user's culture
        /// </summary>
        public string Culture { get; set; } = "en";

        /// <summary>
        /// The user's UI culture
        /// </summary>
        public string UICulture { get; set; } = "en";
        public string? Social { get; set; }
        public string? Website { get; set; }
        public string? Info { get; set; }
        public Guid? ProfileBackgroundId { get; set; }
        public FileStorage? ProfileBackground { get; set; }

        /// <summary>
        /// Navigation property for the roles this user belongs to.
        /// </summary>
        public virtual ICollection<ApplicationUserRole> UserRoles { get; set; } = new List<ApplicationUserRole>();
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
