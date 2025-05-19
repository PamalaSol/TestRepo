using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Infrastructure.Persistence.Repositories
{
    public class MenuRepository : BaseRepository<Menu, Guid>, IMenuRepository
    {
  
        public MenuRepository(PersistenceDbContext dbContext) : base(dbContext)
        {
        }
        public void Add(Menu menu)
        {
            Context.Menu.Add(menu);
        }

        public void Update(Menu menu)
        {
            Context.Menu.Update(menu);
        }


    }
}
