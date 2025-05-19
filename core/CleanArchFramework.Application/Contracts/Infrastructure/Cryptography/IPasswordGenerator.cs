namespace CleanArchFramework.Application.Contracts.Infrastructure.Cryptography;

public interface IPasswordGenerator
{
    string GenerateRandomPassword();
}