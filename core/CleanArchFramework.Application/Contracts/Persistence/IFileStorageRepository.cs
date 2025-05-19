using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using System.Linq.Expressions;

namespace CleanArchFramework.Application.Contracts.Persistence
{
    public interface IFileStorageRepository : IBaseRepository<FileStorage, Guid>
    {
      public  Task<PagedResult<FileStorage>> GetPagedAndOrderResponseAsync(Expression<Func<FileStorage, bool>> predicate, QueryOptions options, int language = 1);
    }
}
