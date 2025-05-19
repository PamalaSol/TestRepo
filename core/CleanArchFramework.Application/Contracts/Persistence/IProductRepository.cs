using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using System.Linq.Expressions;

namespace CleanArchFramework.Application.Contracts.Persistence
{
    public interface IProductRepository : IBaseRepository<Product, Guid>
    {
        Task<Product?> GetFirstProductNoTrackingAsync(Expression<Func<Product, bool>> predicate, int language = 1);
        Task<Product?> GetFirstProductAsync(Expression<Func<Product, bool>> predicate, int language = 1);
        Task<PagedResult<Product>> GetPagedProductAndOrderResponseAsync(Expression<Func<Product, bool>> predicate,
            QueryOptions options, Expression<Func<Product, object>> defaultOrderExpression,
            Expression<Func<Product, object>> customDateOrderExpression, int language);

    }
}
