namespace CleanArchFramework.Application.Contracts.Infrastructure
{
    public interface IUtilityService
    {
       public Task<bool?> RemoveAllUnusedLocalizationSets();
       public Task<bool?> RemoveAllUnusedFileSets();
    }
}
