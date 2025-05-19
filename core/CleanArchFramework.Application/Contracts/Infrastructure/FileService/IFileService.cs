using CleanArchFramework.Application.Shared.Result;

namespace CleanArchFramework.Application.Contracts.Infrastructure.FileService
{
    public interface IFileService
    {
        Task<Result> SaveFile(byte[] fileData, string fileName, string? newFileName, bool isFile = true);
        Task<byte[]> GetFile(string fileName);
        FileStream GetFileStream(string fileName);
        Task<string> GetBase64File(string fileName, string fileType);
        bool DeleteFile(string fileName);
        Task DeleteFileAsync(string filePath);
        string GetMimeType(string fileName);
    }
}
