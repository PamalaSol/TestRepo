using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Infrastructure.Persistence.Repositories
{
    internal class SiteSettingsRepository : BaseRepository<SiteSettings, int>, ISiteSettingsRepository

    {
        public SiteSettingsRepository(PersistenceDbContext context) : base(context)
        {
        }
    }
}
