using System.Linq.Expressions;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Exceptions;
using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using CleanArchFramework.Infrastructure.Persistence.Repositories.Extensions;
using Microsoft.EntityFrameworkCore;

namespace CleanArchFramework.Infrastructure.Persistence.Repositories
{
    public class CategoryRepository : BaseRepository<Category, int>, ICategoryRepository
    {
        public CategoryRepository(PersistenceDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<PagedResult<Category>> GetPagedCategoryOrderResponseAsync(Expression<Func<Category, bool>> predicate, QueryOptions options, Expression<Func<Category, object>> defaultOrderExpression, Expression<Func<Category, object>> customDateOrderExpression)
        {
            var serviceResult = new PagedResult<Category>();
            var query = DbSet.AsQueryable();
            serviceResult.GetPaged(query, options.PageNo, options.PageSize);
            query = DbSet.Include(x => x.Image)
                .Where(predicate);

            query = options.ApplyOrderBy(query, defaultOrderExpression, customDateOrderExpression);

            query = query.Skip(options.Skip).Take(options.PageSize);
            var includes = EntityExtensions.GetNavigations<Category>();
            query = includes(query);
            serviceResult.Data = await query
                .AsNoTracking().ToListAsync();

            return serviceResult;
        }
        public async Task<Category> GetCategoryAsync(int id)
        {
            var query = DbSet
                .Include(x => x.Image).AsQueryable();
            var includes = EntityExtensions.GetNavigations<Category>();
            query = includes(query);

            var entity = await query.FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null) throw new NotFoundException(nameof(Category), entity);

            return entity;
        }
    }

}
