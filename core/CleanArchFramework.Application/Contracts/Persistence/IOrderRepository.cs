using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using System.Linq.Expressions;

namespace CleanArchFramework.Application.Contracts.Persistence
{
    public interface IOrderRepository : IBaseRepository<Order, Guid>
    {
        Task<PagedResult<Order>> GetPagedOrderResponseAsync(Expression<Func<Order, bool>> predicate,
            QueryOptions options, Expression<Func<Order, object>> defaultOrderExpression,
            Expression<Func<Order, object>> customDateOrderExpression);

        Task<Order> GetDetailOrderAsync(Guid id);
        Task<Order> GetOrderAsync(Guid id);
    }
}
