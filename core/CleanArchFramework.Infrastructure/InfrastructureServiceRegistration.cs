using CleanArchFramework.Application.Contracts.Persistence;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using CleanArchFramework.Infrastructure.Infrastructure.Communication.Email;
using CleanArchFramework.Infrastructure.Persistence;
using CleanArchFramework.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Infrastructure.Identity.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using CleanArchFramework.Application.Contracts.Infrastructure;
using CleanArchFramework.Application.Contracts.Infrastructure.Communication;
using CleanArchFramework.Application.Contracts.Infrastructure.Cryptography;
using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Options.ConfigOptions;
using CleanArchFramework.Domain.Entities;
using CleanArchFramework.Infrastructure.Identity.Services;
using CleanArchFramework.Infrastructure.Infrastructure;
using CleanArchFramework.Infrastructure.Infrastructure.Cryptography;
using CleanArchFramework.Infrastructure.Infrastructure.FileService;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using FileOptions = CleanArchFramework.Infrastructure.Infrastructure.FileService.FileOptions;
using CleanArchFramework.Infrastructure.Infrastructure.Captcha;

namespace CleanArchFramework.Infrastructure
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<EmailOptions>(configuration.GetSection("EmailSettings"));
            services.Configure<FileOptions>(configuration.GetSection("FileSettings"));
            services.Configure<EnvironmentOptions>(configuration.GetSection("EnvironmentSettings"));
            services.Configure<GoogleCaptchaOptions>(configuration.GetSection("GoogleCaptcha"));
            services.AddLocalization();

            services.AddTransient<IEmailService, EmailService>();
            services.AddTransient<IPasswordGenerator, PasswordGeneratorService>();
            return services;
        }

        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddDbContext<PersistenceDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("WebApiDatabase"))
                    .LogTo(Console.WriteLine, LogLevel.Information)
                    .EnableSensitiveDataLogging(false));

            services.AddScoped(typeof(IBaseRepository<,>), typeof(BaseRepository<,>));

            services.AddScoped<IMenuRepository, MenuRepository>();
            services.AddScoped<IPostRepository, PostRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ITagRepository, TagRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAboutRepository, AboutRepository>();
            services.AddScoped<IFaqRepository, FaqRepository>();
            services.AddScoped<ISiteSettingsRepository, SiteSettingsRepository>();
            services.AddScoped<IFileCategoryRepository, FileCategoryRepository>();
            services.AddScoped<IProductCategoryRepository, ProductCategoryRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IFileStorageRepository, FileStorageRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<FileHelper, FileHelper>();
            services.AddScoped<IUtilityService, UtilityService>();
            services.AddScoped<IGoogleRecaptchaV3Service, GoogleRecaptchaV3Service>();

            return services;
        }

        public static void AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JwtOptions>(configuration.GetSection("JwtSettings"));

            //services.AddDbContext<IdentityDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("IdentityWebApiDatabase"),
            //    b => b.MigrationsAssembly(typeof(IdentityDbContext).Assembly.FullName)));
            //services.AddDbContext<IdentityDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("IdentityWebApiDatabase"),
            //    b => b.MigrationsAssembly(typeof(IdentityDbContext).Assembly.FullName)));
            services.AddIdentity<ApplicationUser, ApplicationRole>(opt =>
                {
                    opt.Password.RequiredLength = 6;
                })
                .AddEntityFrameworkStores<PersistenceDbContext>()
                .AddDefaultTokenProviders();

            services.Configure<DataProtectionTokenProviderOptions>(o =>
                o.TokenLifespan = TimeSpan.FromDays(7)
                );

            services.AddTransient<IAuthenticationService, AuthenticationService>();
            services.AddTransient<IUserAuthenticationService, UserAuthenticationService>();
            services.AddTransient<IAuthorizationService, AuthorizationService>();
            services.AddTransient<IJwtProvider, JwtProvider>();
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(o =>
                {
                    o.RequireHttpsMetadata = false;
                    o.SaveToken = false;
                    o.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero,
                        ValidIssuer = configuration["JwtSettings:Issuer"],
                        ValidAudience = configuration["JwtSettings:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.
                            UTF8.GetBytes(configuration["JwtSettings:Key"] ?? throw new Exception("MISSING Configuration: JWT KEY!")))
                    };

                    o.Events = new JwtBearerEvents()
                    {
                        OnAuthenticationFailed = c =>
                        {
                            c.NoResult();
                            c.Response.StatusCode = 500;
                            c.Response.ContentType = "text/plain";
                            return c.Response.WriteAsync(c.Exception.ToString());
                        },
                        OnChallenge = context =>
                        {
                            context.HandleResponse();
                            context.Response.StatusCode = 401;
                            context.Response.ContentType = "application/json";
                            var result = JsonSerializer.Serialize("401 Not authorized");
                            return context.Response.WriteAsync(result);
                        },
                        OnForbidden = context =>
                        {
                            context.Response.StatusCode = 403;
                            context.Response.ContentType = "application/json";
                            var result = JsonSerializer.Serialize("403 Not authorized");
                            return context.Response.WriteAsync(result);
                        }
                    };
                });
        }
    }
}
