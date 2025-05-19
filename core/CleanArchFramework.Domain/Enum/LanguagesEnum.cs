namespace CleanArchFramework.Domain.Enum
{
    public class LanguagesEnumClass
    {
        public static readonly Dictionary<string, int> LanguageIdMap = new Dictionary<string, int>
        {
            { "de-DE", 1 },
            { "en-US", 2 },
            { "fr-FR", 3 }
            // Add more mappings if needed
        };
    }
}
