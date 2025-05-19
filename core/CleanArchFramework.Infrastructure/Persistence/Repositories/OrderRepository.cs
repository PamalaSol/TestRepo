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
    public class OrderRepository : BaseRepository<Order, Guid>, IOrderRepository
    {
        public OrderRepository(PersistenceDbContext dbContext) : base(dbContext)
        {

        }
        public async Task<PagedResult<Order>> GetPagedOrderResponseAsync(Expression<Func<Order, bool>> predicate, QueryOptions options, Expression<Func<Order, object>> defaultOrderExpression, Expression<Func<Order, object>> customDateOrderExpression)
        {
            var serviceResult = new PagedResult<Order>();
            var query = DbSet
                .AsQueryable();
            serviceResult.GetPaged(query, options.PageNo, options.PageSize);
            query = DbSet.Include(x => x.OrderedItems)
                .Include(x => x.OrderStatus)
                .ThenInclude(x => x.Name)
                .ThenInclude(x => x.Localizations)
                .Include(x => x.OrderStatus)
                .ThenInclude(x => x.Description)
                .ThenInclude(x => x.Localizations)
                .Where(predicate);

            query = options.ApplyOrderBy(query, defaultOrderExpression, customDateOrderExpression);

            query = query.Skip(options.Skip).Take(options.PageSize);
            var includes = EntityExtensions.GetNavigations<Order>();
            query = includes(query);
            serviceResult.Data = await query
                .AsNoTracking().ToListAsync();

            return serviceResult;
        }
        public async Task<Order> GetDetailOrderAsync(Guid id)
        {
            var query = DbSet.AsNoTracking()
                 .Include(x => x.OrderedItems)
                .ThenInclude(x => x.SleeveProduct)
                .Include(x => x.OrderedItems)
                .ThenInclude(x => x.ValveProduct)
                .Include(x => x.OrderedItems)
                .ThenInclude(x => x.AccessoriesProduct)
                .Include(x => x.OrderStatus)
                .ThenInclude(x => x.Name)
                .ThenInclude(x => x.Localizations)
                .Include(x => x.OrderStatus)
                .ThenInclude(x => x.Description)
                .ThenInclude(x => x.Localizations)
                .AsQueryable();
            var includes = EntityExtensions.GetNavigations<Order>();
            query = includes(query);

            var entity = await query.FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null) throw new NotFoundException(nameof(Order), entity);

            return entity;
        }
        public async Task<Order> GetOrderAsync(Guid id)
        {
            var query = DbSet
                .Include(x => x.OrderedItems)
                .Include(x => x.OrderStatus)
                .ThenInclude(x => x.Name)
                .ThenInclude(x => x.Localizations)
                .Include(x => x.OrderStatus)
                .ThenInclude(x => x.Description)
                .ThenInclude(x => x.Localizations)
                .AsQueryable();
            var includes = EntityExtensions.GetNavigations<Order>();
            query = includes(query);

            var entity = await query.FirstOrDefaultAsync(x => x.Id == id);

            return entity ?? null;
        }
    }
}
