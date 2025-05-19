using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

using OpenApiSchema = Microsoft.OpenApi.Models.OpenApiSchema;

namespace CleanArchFramework.API.Helper
{
    public class AcceptLanguageHeaderParameter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var parameter = new OpenApiParameter
            {
                Name = "Accept-Language",
                In = ParameterLocation.Header,
                Description = "Language preference for the response.",
                Required = true,
                Schema = new OpenApiSchema
                {
                    Type = "string",
                    Default = new OpenApiString("de-DE"),
                    Enum = new List<IOpenApiAny>
                        {
                            new OpenApiString("de-DE"),
                            new OpenApiString("en-US"),
                            new OpenApiString("fr-FR")
                        }
                }
            };

            operation.Parameters.Add(parameter);
        }
    }

}

