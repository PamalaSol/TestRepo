using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Application.Contracts.Persistence;

public interface IMenuRepository : IBaseRepository<Menu, Guid>
{
    void Add(Menu menu);
}
  