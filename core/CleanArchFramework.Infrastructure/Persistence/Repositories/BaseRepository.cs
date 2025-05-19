using System.Linq.Expressions;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Exceptions;
using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Common;
using CleanArchFramework.Infrastructure.Persistence.Repositories.Extensions;
using Microsoft.EntityFrameworkCore;


namespace CleanArchFramework.Infrastructure.Persistence.Repositories
{
    public class BaseRepository<TEntity, T> : IBaseRepository<TEntity, T> where TEntity : BaseEntity<T>
    {
        protected readonly PersistenceDbContext Context;
        protected readonly DbSet<TEntity> DbSet;

        protected BaseRepository(PersistenceDbContext context)
        {
            Context = context;
            DbSet = context.Set<TEntity>();
        }

        public async Task<TEntity> AddAsync(TEntity entity)
        {
            var addedEntity = (await DbSet.AddAsync(entity)).Entity;


            return addedEntity;
        }
        public async void AddRange(IEnumerable<TEntity> entity)
        {
            await DbSet.AddRangeAsync(entity);
        }

        public async Task<TEntity> DeleteAsync(TEntity entity)
        {
            var removedEntity = DbSet.Remove(entity).Entity;

            return removedEntity;
        }
        public async Task<TEntity> DeleteAsyncById(object key)
        {
            var entity = DbSet.Find(key);
            if (entity == null)
            {
                return null;
            }

            DbSet.Remove(entity);
            await Context.SaveChangesAsync();
            return entity;
        }

        public void DeleteRangeAsync(IEnumerable<TEntity> entities)
        {
            DbSet.RemoveRange(entities);
        }
        public async Task<TEntity> GetFirstAsync(T requestId)
        {

            var query = DbSet.AsQueryable();
            var includes = EntityExtensions.GetNavigations<TEntity>();
            query = includes(query);
            var entity = await query.FirstOrDefaultAsync(x => x.Id != null && x.Id.Equals(requestId));
            if (entity == null) throw new NotFoundException(nameof(entity), entity);

            return entity;
        }

        public async Task<List<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> predicate)
        {
            var query = DbSet.Where(predicate).AsQueryable();
            var includes = EntityExtensions.GetNavigations<TEntity>();
            query = includes(query);
            var entity = await query.ToListAsync();
            return entity;
        }
        public async Task<List<TEntity>> GetAllNoTrackingAsync(Expression<Func<TEntity, bool>> predicate)
        {
            var query = DbSet.Where(predicate).AsQueryable();
            var includes = EntityExtensions.GetNavigations<TEntity>();
            query = includes(query);
            var entity = await query.AsNoTracking().ToListAsync();
            return entity;
        }

        public async Task<List<TEntity>> GetPagedResponseAsync(Expression<Func<TEntity, bool>> predicate, int page,
            int size)
        {

            return await DbSet.Where(predicate).Skip((page - 1) * size).Take(size).AsNoTracking().ToListAsync();
        }

        public async Task<PagedResult<TEntity>> GetPagedAndOrderResponseAsync(Expression<Func<TEntity, bool>> predicate,
            QueryOptions options, Expression<Func<TEntity, object>> defaultOrderExpression,
            Expression<Func<TEntity, object>> customDateOrderExpression)
        {
            var serviceResult = new PagedResult<TEntity>();

            var query = DbSet.AsQueryable();
            serviceResult.GetPaged(query, options.PageNo, options.PageSize);
            query = query.Where(predicate);
            query = options.ApplyOrderBy(query, defaultOrderExpression, customDateOrderExpression);
            query = query.Skip(options.Skip).Take(options.PageSize);
            var includes = EntityExtensions.GetNavigations<TEntity>();
            query = includes(query);
            serviceResult.Data = await query.AsNoTracking().ToListAsync();
            return serviceResult;
        }

        public async Task<TEntity> GetFirstAsync(Expression<Func<TEntity, bool>> predicate)
        {
            var query = DbSet.Where(predicate).AsQueryable();
            var includes = EntityExtensions.GetNavigations<TEntity>();
            query = includes(query);
            var entity = await query
                .FirstOrDefaultAsync();

            if (entity == null) throw new NotFoundException(nameof(entity), entity);

            return entity;
        }
        public async Task<TEntity> GetFirstNoTrackingAsync(Expression<Func<TEntity, bool>> predicate)
        {
            var query = DbSet.Where(predicate).AsNoTracking().AsQueryable();
            var includes = EntityExtensions.GetNavigations<TEntity>();
            query = includes(query);
            var entity = await query.FirstOrDefaultAsync();

            if (entity == null) throw new NotFoundException(nameof(entity), entity);

            return entity;
        }
        [Obsolete]
        public async Task<TEntity> UpdateAsync(TEntity entity)
        {
            DbSet.Update(entity);

            return entity;
        }
        public TEntity Update(TEntity entity)
        {
            DbSet.Update(entity);

            return entity;
        }
        public async Task<int> CountRecords(Expression<Func<TEntity, bool>>? predicate)
        {
            return await DbSet.CountAsync(predicate ?? throw new ArgumentNullException(nameof(predicate)));
        }

    }
}
