using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Application.Contracts.Persistence
{
    public interface IAboutRepository : IBaseRepository<About,int>
    {
        public Task<About> GetFirstAboutAsync();
    }
}
