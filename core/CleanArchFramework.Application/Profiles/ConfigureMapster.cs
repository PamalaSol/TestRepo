using CleanArchFramework.Application.Models.Authentication;
using CleanArchFramework.Application.Models.Authentication.Public;
using CleanArchFramework.Domain.Entities;
using Mapster;

namespace CleanArchFramework.Application.Profiles
{
    public class MappingRegistration : IRegister
    {
        void IRegister.Register(TypeAdapterConfig config)
        {
            var helper = new SharedMappingHelper();

            config.NewConfig<UpdateUserBase, UpdateUser>()
                .Ignore(x => x.ProfilePictureFile);

            config.NewConfig<ApplicationUser, GetUser>()
                .Map(dest => dest.Roles, src => src.UserRoles.Select(x => x.Role.Name));

        }
    }
}
