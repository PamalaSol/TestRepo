using Microsoft.EntityFrameworkCore;
using System.Data;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Domain.Common;
using Microsoft.EntityFrameworkCore.Storage;
using CleanArchFramework.Application.Contracts;

namespace CleanArchFramework.Infrastructure.Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly PersistenceDbContext _applicationDbContext;
        private readonly ILoggedInUserService? _loggedInUserService;
        public UnitOfWork(PersistenceDbContext applicationDbContext, ILoggedInUserService loggedInUserService)
        {
            _applicationDbContext = applicationDbContext;
            _loggedInUserService = loggedInUserService;
        }
        public EntityState SetAdded<T>(T entity)
        {
            var transaction = _applicationDbContext.Entry(entity).State = EntityState.Added;
            return transaction;
        }
        public EntityState SetUpdated<T>(T entity)
        {
            var transaction = _applicationDbContext.Entry(entity).State = EntityState.Modified;
            return transaction;
        }
        public EntityState SetDetached<T>(T entity)
        {
            var transaction = _applicationDbContext.Entry(entity).State = EntityState.Detached;
            return transaction;
        }

        public async Task<IDbTransaction> BeginTransaction()
        {
            var transaction = await _applicationDbContext.Database.BeginTransactionAsync();
            return transaction.GetDbTransaction();
        }
        public async Task CommitTransaction()
        {
            await _applicationDbContext.Database.CommitTransactionAsync();
        }
        public async Task RollBackTransaction()
        {
            await _applicationDbContext.Database.RollbackTransactionAsync();
        }
        [Obsolete]
        public async Task SaveAsync()
        {
            UpdateEntities();
            await _applicationDbContext.SaveChangesAsync();
        }

        public async Task SaveAsync(CancellationToken cancellationToken)
        {
            UpdateEntities(cancellationToken);

            await _applicationDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task SaveAsync(CancellationToken cancellationToken, bool updateEntities)
        {
            if (updateEntities)
            {
                UpdateEntities(cancellationToken);
            }

            await _applicationDbContext.SaveChangesAsync(cancellationToken);
        }

        public void UpdateEntities(CancellationToken cancellationToken = new())
        {
            foreach (var entry in _applicationDbContext.ChangeTracker.Entries<IAuditableEntity>())
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedBy = _loggedInUserService?.UserId;
                        entry.Entity.CreatedDate = DateTime.UtcNow;
                        break;
                    case EntityState.Modified:
                        entry.Entity.ModifiedBy = _loggedInUserService?.UserId;
                        entry.Entity.ModifiedOn = DateTime.UtcNow;
                        break;
                }
        }
    }
}
