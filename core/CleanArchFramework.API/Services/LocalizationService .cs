using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Domain.Enum;

namespace CleanArchFramework.API.Services
{
    public class LocalizationService : ILocalizationService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
    
        public LocalizationService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        }

        public  string GetCurrentLanguage()
        {
            return _httpContextAccessor.HttpContext?.Request.Headers["Accept-Language"];
        }
        public  int GetCurrentLanguageId()
        {

            var strLanguage = _httpContextAccessor.HttpContext?.Request.Headers["Accept-Language"];
            return LanguagesEnumClass.LanguageIdMap.TryGetValue(strLanguage, out var lngId) ? lngId : 0;

        }

        public Dictionary<string, int> GetAvailableLanguages()
        {
            return LanguagesEnumClass.LanguageIdMap;

        }
    }
}
