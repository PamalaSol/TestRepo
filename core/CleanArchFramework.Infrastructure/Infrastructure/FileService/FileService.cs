using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Shared.Result;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CleanArchFramework.Infrastructure.Infrastructure.FileService
{
    public class FileService : IFileService
    {
        private readonly string _storageDirectory;
        private readonly FileOptions _fileOptions;
        private readonly ILogger<FileService> _logger;

        public FileService(IOptions<FileOptions> fileOptions, ILogger<FileService> logger)
        {
            _fileOptions = fileOptions.Value;
            _logger = logger;
            EnsureStorageDirectoryExists();
            _storageDirectory = _fileOptions.StorageLocation;
        }

        public async Task<Result> SaveFile(byte[] fileData, string fileName, string? newFileName, bool isFile = true)
        {
            Result result = new Result();
            try
            {
                int maxSize = _fileOptions.MaxFileSize;
                int fileSize = fileData.Length;
                if (fileSize > maxSize) //20MB
                {
                    result.Message += "Files exceeded " + maxSize;
                    result.AddError(result.Message);
                    result.Fail();
                    return result;
                }
                if (newFileName is null) { newFileName = fileName; }
                if (!isFile && !GetContentType(fileName))
                {
                    result.Message += newFileName + " is not in supported format \n";
                    result.AddError(result.Message);
                    result.Fail();
                    return result;
                }

                if (isFile && !GetFileContentType(fileName))
                {
                    result.Message += newFileName + " is not in supported format \n";
                    result.AddError(result.Message);
                    result.Fail();
                    return result;
                }

                string filePath = Path.Combine(_fileOptions.StorageLocation, newFileName);

                using (FileStream fs = File.Create(filePath))
                {
                    await fs.WriteAsync(fileData, 0, fileData.Length);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Error saving file: {ex.Message}");
                result.Message += $"Server error while saving file {fileName} is not in supported format \n";
                result.AddError(result.Message);
                result.Fail();
                return result;
            }


        }

        public async Task<byte[]> GetFile(string fileName)
        {
            try
            {
                if (string.IsNullOrEmpty(fileName))
                {
                    return null;

                }
                string filePath = Path.Combine(_fileOptions.StorageLocation, fileName);

                if (File.Exists(filePath))
                {
                    return await File.ReadAllBytesAsync(filePath);
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Error reading whole file: {ex.Message}");
                return null;
            }
        }

        public FileStream GetFileStream(string fileName)
        {
            try
            {
                if (string.IsNullOrEmpty(fileName))
                {
                    return null;

                }
                string filePath = Path.Combine(_fileOptions.StorageLocation, fileName);
                var fileProvider = new PhysicalFileProvider(filePath);
                var fileInfo = fileProvider.GetFileInfo(fileName);
                if (fileInfo.Exists)
                {
                    var fileStream = new FileStream(filePath, FileMode.Open);
                    return fileStream;
                }
                return null;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Error reading file stream: {ex.Message}");
                return null;
            }
        }

        public async Task<string> GetBase64File(string fileName, string fileType)
        {
            try
            {
                if (string.IsNullOrEmpty(fileName))
                {
                    return null;

                }
                string filePath = Path.Combine(_fileOptions.StorageLocation, fileName);

                if (File.Exists(filePath))
                {
                    var file = await File.ReadAllBytesAsync(filePath);
                    return ("data:" + fileType + ";base64,") + Convert.ToBase64String(file);
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Error reading base64 file: {ex.Message}");
                return null;
            }
        }
        public async Task DeleteFileAsync(string filePath)
        {
            await Task.Run(() => DeleteFile(filePath));
        }
        public bool DeleteFile(string fileName)
        {
            try
            {
                string filePath = Path.Combine(_fileOptions.StorageLocation, fileName);

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Error saving file: {ex.Message}");
                return false;
            }
        }
        private void EnsureStorageDirectoryExists()
        {
            if (!Directory.Exists(_fileOptions.StorageLocation))
            {
                Directory.CreateDirectory(_fileOptions.StorageLocation);
            }
        }

        private bool GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types.ContainsKey(ext);
        }

        private bool GetFileContentType(string path)
        {
            var types = GetFileMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types.ContainsKey(ext);
        }

        private static Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                //{".txt", "text/plain"},
                //{".pdf", "application/pdf"},
                //{".doc", "application/vnd.ms-word"},
                //{".docx", "application/vnd.ms-word"},
                //{".xls", "application/vnd.ms-excel"},
                //{".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".svg", "image/svg+xml"},
                {".webp", "image/webp"}
                //{".csv", "text/csv"}
            };
        }
        public string GetMimeType(string fileName)
        {
            // Create an instance of FileExtensionContentTypeProvider
            var provider = new FileExtensionContentTypeProvider();

            // Try to get the MIME type based on the file extension
            if (!provider.TryGetContentType(fileName, out string mimeType))
            {
                // If the MIME type can't be determined, set a default type
                throw new Exception("invalid file type");
                mimeType = "application/octet-stream";
            }

            return mimeType;
        }
        public static Dictionary<string, string> GetFileMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"},
                {".svg", "image/svg+xml"},
                {".webp", "image/webp"},
                {".zip", "application/zip"},
                {".rar", "application/x-rar-compressed"},
                {".7z", "application/x-7z-compressed"},
                {".tar", "application/x-tar"},
                {".gz", "application/gzip"},
                {".stp", "application/STEP"},
                {".dwg", "image/vnd.dwg"},
                {".dxf", "image/vnd.dxf"},
                {".stl", "application/vnd.ms-pki.stl"},
            };
        }
        private static bool IsJpeg(byte[] buffer)
        {
            return buffer.Length >= 2 &&
                   buffer[0] == 0xFF &&
                   buffer[1] == 0xD8;
        }

        private static bool IsPng(byte[] buffer)
        {
            return buffer.Length >= 8 &&
                   buffer[0] == 0x89 &&
                   buffer[1] == 0x50 &&
                   buffer[2] == 0x4E &&
                   buffer[3] == 0x47 &&
                   buffer[4] == 0x0D &&
                   buffer[5] == 0x0A &&
                   buffer[6] == 0x1A &&
                   buffer[7] == 0x0A;
        }

        private static bool IsGif(byte[] buffer)
        {
            return buffer.Length >= 6 &&
                   (buffer[0] == 0x47 && buffer[1] == 0x49 && buffer[2] == 0x46) &&
                   (buffer[3] == 0x38 && (buffer[4] == 0x39 || buffer[4] == 0x37) && buffer[5] == 0x61);
        }
    }
}
