using Microsoft.AspNetCore.Identity;

namespace CleanArchFramework.Domain.Entities
{
    public sealed class ApplicationUserRole : IdentityUserRole<string>
    {

        public ApplicationUser User { get; set; }
        public ApplicationRole Role { get; set; }
    }
   
}
