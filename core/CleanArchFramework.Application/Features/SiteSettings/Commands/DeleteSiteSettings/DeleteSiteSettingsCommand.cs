using MediatR;

namespace CleanArchFramework.Application.Features.SiteSettings.Commands.DeleteSiteSettings
{
    public class DeleteSiteSettingsCommand : IRequest<DeleteSiteSettingsCommandResponse>
    {
        public int Id { get; set; }

    }
    
}
