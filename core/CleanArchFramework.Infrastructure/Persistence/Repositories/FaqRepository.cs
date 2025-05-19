using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Infrastructure.Persistence.Repositories
{
    public class FaqRepository : BaseRepository<Faq,int>, IFaqRepository
    {
        public FaqRepository(PersistenceDbContext dbContext) : base(dbContext)
        {
        }
    }
}
