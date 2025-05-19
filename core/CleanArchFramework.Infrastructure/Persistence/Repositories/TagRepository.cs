using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Infrastructure.Persistence.Repositories
{
    public class TagRepository : BaseRepository<Tag, int>, ITagRepository
    {
        public TagRepository(PersistenceDbContext dbContext) : base(dbContext)
        {
        }
    }
}

