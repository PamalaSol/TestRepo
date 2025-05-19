using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using System.Linq.Expressions;

namespace CleanArchFramework.Application.Contracts.Persistence
{
    public interface ICategoryRepository : IBaseRepository<Category, int>
    {
        Task<PagedResult<Category>> GetPagedCategoryOrderResponseAsync(Expression<Func<Category, bool>> predicate,
            QueryOptions options, Expression<Func<Category, object>> defaultOrderExpression,
            Expression<Func<Category, object>> customDateOrderExpression);
        Task<Category> GetCategoryAsync(int id);
    }
}