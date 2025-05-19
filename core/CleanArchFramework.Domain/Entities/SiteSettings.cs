using CleanArchFramework.Domain.Common;

namespace CleanArchFramework.Domain.Entities;

public sealed class SiteSettings : BaseEntity<int>, IAuditableEntity
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
    public int Version { get; set; }

    public string? CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public string? ModifiedBy { get; set; }
    public DateTime? ModifiedOn { get; set; }
}