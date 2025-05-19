namespace CleanArchFramework.Application.Contracts.Identity;

public interface IJwtProvider
{
    /// <summary>
    /// Gets the access tokens for the specified user.
    /// </summary>
    /// <param name="stringId">The user.</param>
    /// <param name="minutesValid"></param>
    /// <returns>The access tokens for the specified user.</returns>
    Task<string> CreateJwtAsync(string stringId, double? minutesValid = null);
    T ReadJwt<T>(string jwt);
}