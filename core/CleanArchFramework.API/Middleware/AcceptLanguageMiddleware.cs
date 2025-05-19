using System.Globalization;

namespace CleanArchFramework.API.Middleware
{
    public class AcceptLanguageMiddleware
    {
        private readonly RequestDelegate _next;

        public AcceptLanguageMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Headers.ContainsKey("Accept-Language"))
            {
                var headerValue = context.Request.Headers["Accept-Language"];
                var languages = headerValue.ToString().Split(',');

                // Set the culture based on the first language in the header
                if (languages.Length > 0)
                {
                    var culture = new CultureInfo(languages[0].Trim());
                    CultureInfo.DefaultThreadCurrentCulture = culture;
                    CultureInfo.DefaultThreadCurrentUICulture = culture;
                }
                else
                {
                    CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("de-DE");
                    CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("de-DE");
                }
            }
            else
            {
                CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("de-DE");
                CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("de-DE");
            }

            await _next(context);
        }
    }
}
