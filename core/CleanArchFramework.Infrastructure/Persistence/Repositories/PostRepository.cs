using Microsoft.EntityFrameworkCore;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Exceptions;
using CleanArchFramework.Domain.Entities;
using System.Linq.Expressions;
using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Infrastructure.Persistence.Repositories.Extensions;


namespace CleanArchFramework.Infrastructure.Persistence.Repositories
{
    public class PostRepository : BaseRepository<Post, Guid>, IPostRepository
    {
        public PostRepository(PersistenceDbContext context) : base(context)
        {
        }

        public async Task<Post> GetFirstPostNoTrackingAsync(Expression<Func<Post, bool>> predicate)
        {
            var query = DbSet.Where(predicate).AsNoTracking().AsQueryable();
            query = query.Include(x => x.Categories)
                .Include(x => x.Tags)
                .Include(x => x.Image);
            var includes = EntityExtensions.GetNavigations<Post>();
            query = includes(query);

            var entity = await query.FirstOrDefaultAsync();

            if (entity == null) throw new NotFoundException(nameof(entity), entity);

            return entity;
        }

        public async Task<PagedResult<Post>> GetPagedPostAndOrderResponseAsync(Expression<Func<Post, bool>> predicate,
            QueryOptions options, Expression<Func<Post, object>> defaultOrderExpression,
            Expression<Func<Post, object>> customDateOrderExpression)
        {
            var serviceResult = new PagedResult<Post>();

            var query = DbSet.AsQueryable();
            serviceResult.GetPaged(query, options.PageNo, options.PageSize);
            query = query.AsNoTracking().Where(predicate);
            query = query.Include(x => x.Categories)
                .Include(x => x.Image)
                .Include(x => x.Tags);
            query = options.ApplyOrderBy(query, defaultOrderExpression, customDateOrderExpression);
            query = query.Skip(options.Skip).Take(options.PageSize);
            var includes = EntityExtensions.GetNavigations<Post>();
            query = includes(query);
            serviceResult.Data = await query.ToListAsync();
            return serviceResult;
        }

    }
}
