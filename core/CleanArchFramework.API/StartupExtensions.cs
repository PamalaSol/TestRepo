using System.Globalization;
using CleanArchFramework.API.Middleware;
using CleanArchFramework.API.Services;
using CleanArchFramework.Application;
using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Infrastructure;
using Microsoft.OpenApi.Models;
using System.Reflection;
using CleanArchFramework.API.Helper;
using Microsoft.AspNetCore.Localization;

namespace CleanArchFramework.API
{
    public static class StartupExtensions
    {
        public static WebApplication ConfigureServices(
            this WebApplicationBuilder builder)
        {
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Open", corsPolicyBuilder => corsPolicyBuilder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            });
            AddSwagger(builder.Services);

            builder.Services.Configure<RequestLocalizationOptions>(options =>
            {
                var supportedCultures = new[]
                {
                    new CultureInfo("de-DE"),
                    new CultureInfo("en-US"),
                    new CultureInfo("fr-FR"),
                    // Add more supported cultures as needed
                };

                options.DefaultRequestCulture = new RequestCulture("de-DE");
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;
            });
            builder.Services.AddSingleton<ILocalizationService, LocalizationService>();
            builder.Services.AddIdentityServices(builder.Configuration);
            builder.Services.AddInfrastructureServices(builder.Configuration);
            builder.Services.AddPersistenceServices(builder.Configuration);
            builder.Services.AddApplicationServices();
            builder.Services.AddScoped<ILoggedInUserService, LoggedInUserService>();
            builder.Services.AddScoped<FileTypeHelper, FileTypeHelper>();
            builder.Services.AddHttpClient();

            builder.Services.AddHttpContextAccessor();
            builder.Services.AddControllers();



            return builder.Build();

        }


        public static WebApplication ConfigurePipeline(this WebApplication app)
        {
            //if (app.Environment.IsDevelopment())
            //{
            app.UseDeveloperExceptionPage();
            app.UseCors("Open");

            //}
            //else
            //{
            //    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            //    app.UseCors("Open");
            //    app.UseHsts();
            //}
            //if (app.Environment.IsDevelopment())
            //{
            //app.UseSwagger();
            //app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Clean Arch API"); });
            //     }
            app.UseHsts();
            app.UseMiddleware<AcceptLanguageMiddleware>();
            app.UseCustomExceptionHandler();
            app.UseHttpsRedirection();
            //THIS MUST BE THE ORDER
            app.UseRouting();


            app.UseAuthentication();
            // app.UseOptions();
            app.UseAuthorization();

            app.MapControllers();

            return app;

        }
        private static void AddSwagger(IServiceCollection services)
        {

            services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,

                        },
                        new List<string>()
                    }
                });

                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "HO-Matic API",


                });
                c.OperationFilter<AcceptLanguageHeaderParameter>();

                var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
                //   c.OperationFilter<FileResultContentTypeOperationFilter>();
            });

        }
    }
}
