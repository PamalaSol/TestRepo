using CleanArchFramework.Application.Models.Shared;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;


namespace CleanArchFramework.API.Helper
{
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {

            if (context.MethodInfo.DeclaringType == null ||
                context.MethodInfo.GetCustomAttributes(true).OfType<ObsoleteAttribute>().Any())
            {
                // Skip obsolete methods
                return;
            }

            var fileParams = context.MethodInfo.GetParameters()
                .Where(p => p.ParameterType == typeof(List<ExtendedFile>) ||
                            p.ParameterType == typeof(List<ExtendedFile>))
                .ToList();

            foreach (var fileParam in fileParams)
            {
                var propName = fileParam.Name;
                var propType = fileParam.ParameterType.GenericTypeArguments[0];

                var properties = propType.GetProperties()
                    .Where(p => p.PropertyType == typeof(IFormFile) || p.PropertyType == typeof(string));

                foreach (var property in properties)
                {
                    var propertySchema = new OpenApiSchema();

                    if (property.PropertyType == typeof(IFormFile))
                    {
                        propertySchema.Type = "file";
                    }
                    else if (property.PropertyType == typeof(string))
                    {
                        propertySchema.Type = "string";
                    }

                    var param = new OpenApiParameter
                    {
                        Name = $"{propName}.{property.Name}",
                        In = ParameterLocation.Query,
                        Description = $"The {property.Name} for {propName}.",
                        Required = false, // Adjust as needed
                        Schema = propertySchema
                    };

                    operation.Parameters.Add(param);
                }
            }
        }
    }
}
