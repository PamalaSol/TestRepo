using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Infrastructure.Persistence.Repositories
{
    public class FileCategoryRepository : BaseRepository<FileCategory, int>, IFileCategoryRepository
    {
        public FileCategoryRepository(PersistenceDbContext dbContext) : base(dbContext)
        {
        }
    }
}
