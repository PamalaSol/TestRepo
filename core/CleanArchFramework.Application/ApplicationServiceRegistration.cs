using Mapster;

using System.Reflection;
using MapsterMapper;
using Microsoft.Extensions.DependencyInjection;

namespace CleanArchFramework.Application
{
    public static class ApplicationServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            var typeAdapterConfig = new TypeAdapterConfig();//TypeAdapterConfig.GlobalSettings;
            // scans the assembly and gets the IRegister, adding the registration to the TypeAdapterConfig
            typeAdapterConfig.Scan(Assembly.GetExecutingAssembly());
            // register the mapper as Singleton service for my application
         //   var mapperConfig = new Mapper(typeAdapterConfig);
            services
                .AddSingleton(typeAdapterConfig)
                .AddScoped<IMapper, ServiceMapper>();
            //   services.AddScoped<IMapper, ServiceMapper>();
            //   services.AddMediatR(cfg =>cfg.RegisterServicesFromAssemblies(typeof(CreateMenuCommandResponse).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(AppDomain.CurrentDomain.GetAssemblies()));

            return services;
        }
    }
}
