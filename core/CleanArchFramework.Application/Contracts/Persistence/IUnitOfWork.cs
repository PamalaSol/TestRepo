using System.Data;
using Microsoft.EntityFrameworkCore;

namespace CleanArchFramework.Application.Contracts.Persistence;

public interface IUnitOfWork
{
    Task SaveAsync();
    Task SaveAsync(CancellationToken cancellationToken);
    Task SaveAsync(CancellationToken cancellationToken, bool updateEntities);
    Task<IDbTransaction> BeginTransaction();
    Task CommitTransaction();
    Task RollBackTransaction();
    EntityState SetDetached<T>(T entity);
}