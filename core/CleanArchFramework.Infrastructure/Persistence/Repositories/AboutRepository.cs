using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Exceptions;
using CleanArchFramework.Domain.Entities;
using CleanArchFramework.Infrastructure.Persistence.Repositories.Extensions;
using Microsoft.EntityFrameworkCore;


namespace CleanArchFramework.Infrastructure.Persistence.Repositories
{
    public class AboutRepository : BaseRepository<About, int>, IAboutRepository
    {
        public AboutRepository(PersistenceDbContext dbContext) : base(dbContext)
        {

        }

        public async Task<About> GetFirstAboutAsync()
        {
            var query = DbSet
                .Include(x => x.Image).AsQueryable();
            var includes = EntityExtensions.GetNavigations<About>();
            query = includes(query);
            var entity = await query.FirstOrDefaultAsync();
            if (entity == null) throw new NotFoundException(nameof(About), nameof(About));

            return entity;
        }

    }
}

