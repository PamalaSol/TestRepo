using Microsoft.AspNetCore.Identity;

namespace CleanArchFramework.Domain.Entities
{
    public class ApplicationRole : IdentityRole<string>
    {
        public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }
    }

}
