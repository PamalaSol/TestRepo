namespace CleanArchFramework.Application.Contracts
{
    public  interface ILocalizationService
    {
        public  string GetCurrentLanguage();
        public  int GetCurrentLanguageId();
        Dictionary<string, int> GetAvailableLanguages();
    }
}
