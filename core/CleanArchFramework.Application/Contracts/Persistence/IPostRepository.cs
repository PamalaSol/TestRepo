
using System.Linq.Expressions;
using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Application.Contracts.Persistence
{
    public interface IPostRepository : IBaseRepository<Post,Guid>
    {
        Task<Post> GetFirstPostNoTrackingAsync(Expression<Func<Post, bool>> predicate);

        Task<PagedResult<Post>> GetPagedPostAndOrderResponseAsync(Expression<Func<Post, bool>> predicate,
            QueryOptions options, Expression<Func<Post, object>> defaultOrderExpression,
            Expression<Func<Post, object>> customDateOrderExpression);
    }
}
