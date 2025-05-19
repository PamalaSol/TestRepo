using CleanArchFramework.Domain.Common;
using System.Linq.Expressions;
using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;

namespace CleanArchFramework.Application.Contracts.Persistence;

public interface IBaseRepository<TEntity, T> where TEntity : BaseEntity<T>
{
    Task<TEntity> GetFirstAsync(Expression<Func<TEntity, bool>> predicate);
    Task<TEntity> GetFirstNoTrackingAsync(Expression<Func<TEntity, bool>> predicate);
    Task<TEntity> GetFirstAsync(T requestId);
    Task<List<TEntity>> GetAllNoTrackingAsync(Expression<Func<TEntity, bool>> predicate);
    Task<List<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> predicate);
    Task<List<TEntity>> GetPagedResponseAsync(Expression<Func<TEntity, bool>> predicate, int page, int size);
    Task<PagedResult<TEntity>> GetPagedAndOrderResponseAsync(Expression<Func<TEntity, bool>> predicate,
        QueryOptions queryOptions, Expression<Func<TEntity, object>> defaultOrderExpression,
        Expression<Func<TEntity, object>> customDateOrderExpression);
    Task<TEntity> AddAsync(TEntity entity);
    void AddRange(IEnumerable<TEntity> entity);
    Task<TEntity> UpdateAsync(TEntity entity);
    Task<int> CountRecords(Expression<Func<TEntity, bool>>? predicate = null);
    Task<TEntity> DeleteAsync(TEntity entity);
    void DeleteRangeAsync(IEnumerable<TEntity> entities);
    TEntity Update(TEntity entity);
    Task<TEntity> DeleteAsyncById(object key);
}