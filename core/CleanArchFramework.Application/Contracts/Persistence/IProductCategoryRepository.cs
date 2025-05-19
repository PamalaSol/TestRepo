using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using System.Linq.Expressions;

namespace CleanArchFramework.Application.Contracts.Persistence
{
    public interface IProductCategoryRepository : IBaseRepository<ProductCategory, int>
    {
        Task<PagedResult<ProductCategory>> GetPagedProductCategoryOrderResponseAsync(
            Expression<Func<ProductCategory, bool>> predicate, QueryOptions options,
            Expression<Func<ProductCategory, object>> defaultOrderExpression,
            Expression<Func<ProductCategory, object>> customDateOrderExpression);

        Task<ProductCategory> GetProductCategoryAsync(int id);
    }
}