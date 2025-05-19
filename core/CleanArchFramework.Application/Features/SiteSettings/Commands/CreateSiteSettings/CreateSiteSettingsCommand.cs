using MediatR;

namespace CleanArchFramework.Application.Features.SiteSettings.Commands.CreateSiteSettings
{
    public class CreateSiteSettingsCommand : IRequest<CreateSiteSettingsCommandResponse>
    {
        public string SiteTitle { get; set; }
        public string SiteDescription { get; set; }
        public bool IsMaintenanceMode { get; set; }
        public string LogoUrl { get; set; }
        public bool ShowSearchBar { get; set; }
        public string ContactEmail { get; set; }
        public bool EnableShoppingCart { get; set; }
        public string DefaultCurrency { get; set; }
        public int PostsPerPage { get; set; }
        public bool AllowComments { get; set; }
        public string ThemeColor { get; set; }
        public string DefaultLanguage { get; set; }
        public string DateFormat { get; set; }
        public string CurrencySymbol { get; set; }

    }
}
