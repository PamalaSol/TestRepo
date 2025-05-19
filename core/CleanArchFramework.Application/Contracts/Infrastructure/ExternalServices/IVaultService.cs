using CleanArchFramework.Application.Shared.Result;

namespace CleanArchFramework.Application.Contracts.Infrastructure.ExternalServices
{
    public interface IVaultService
    {
        Task<Result<bool>> ScrapeVault();
    }
}
