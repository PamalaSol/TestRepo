using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Features.File.Commands.CreateFile;
using CleanArchFramework.Application.Features.File.Query.GetFile;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using CleanArchFramework.Application.Models.Shared;

namespace CleanArchFramework.Application.Shared.FileHelper
{
    public class FileHelper
    {
        private readonly IFileService _fileService;
        private readonly IMediator _mediator;
        private readonly ILocalizationService _localizationService;
        public FileHelper(IFileService fileService, IMediator mediator, ILocalizationService localizationService)
        {
            _fileService = fileService;
            _mediator = mediator;
            _localizationService = localizationService;
        }
        public string GenerateFileName(GetFileDto file)
        {
            return file.FileName;
        }
        public async Task<CreateFileCommandResponse?> SaveFilesAsync(IFormFile? file)
        {
            if (file is { Length: > 0 })
            {
                // Process the file
                Guid guid = Guid.NewGuid();
                using var memoryStream = new MemoryStream();
                file.CopyTo(memoryStream);
                byte[] fileBytes = memoryStream.ToArray();
                await _fileService.SaveFile(fileBytes, file.FileName, guid.ToString());
                var saveResult = await _mediator.Send(new CreateFileCommand { FileExtension = _fileService.GetMimeType(file.FileName), FileName = file.FileName, FileGuid = guid });
                return saveResult;
            }
            return null;
        }

        public async Task<string> GetBase64String(FileSet fileSet)
        {
            var file = fileSet?.Files?.FirstOrDefault(x => x.LanguageId == _localizationService.GetCurrentLanguageId());
            return await _fileService.GetBase64File(file?.FileGuid.ToString(), file?.FileExtension);

        }
        public async Task<Result<FileSet>?> CreateFileAsync(IFormFile? file, string? alt = null, bool createLocalizedFiles = true, int? fileCategory = null, bool saveFileToDatabase = false, string? fileTitle = null)
        {

            var result = new Result<FileSet>();
            if (file is { Length: > 0 })
            {
                // Process the file
                Guid guid = Guid.NewGuid();
                using var memoryStream = new MemoryStream();
                file.CopyTo(memoryStream);
                byte[] fileBytes = memoryStream.ToArray();
                var saveFileResult = await _fileService.SaveFile(fileBytes, file.FileName, guid.ToString());
                FileSet saveResult = new FileSet();
                if (createLocalizedFiles)
                {
                    List<FileStorage> listOfFiles = new List<FileStorage>();
                    foreach (var lang in _localizationService.GetAvailableLanguages())
                    {
                        listOfFiles.Add(

                            new()
                            {
                                FileExtension = _fileService.GetMimeType(file.FileName),
                                FileName = file.FileName,
                                FileGuid = guid,
                                Alt = alt,
                                LanguageId = lang.Value,
                                FileCategoryId = fileCategory,
                                Title = fileTitle
                            });

                    }

                    saveResult.Files = listOfFiles;
                }
                else
                {
                    if (saveFileToDatabase)
                    {
                        if (saveFileResult.IsFailed)
                        {
                            result.Fail();
                            result.AddErrors(saveFileResult.Errors);
                            return result;
                        }
                        var saveFileToDatabaseResult = await _mediator.Send(new CreateFileCommand { FileExtension = _fileService.GetMimeType(file.FileName), FileName = file.FileName, FileGuid = guid, FileCategoryId = fileCategory, Alt = alt, LanguageId = _localizationService.GetCurrentLanguageId(), Title = fileTitle });
                        result.AddErrors(saveFileToDatabaseResult.Errors);
                        if (saveFileToDatabaseResult.IsFailed)
                        {
                            result.Fail();
                        }
                        else
                        {
                            saveResult = new FileSet { Files = new List<FileStorage> { new FileStorage { Id = saveFileToDatabaseResult.Data.Id, FileExtension = _fileService.GetMimeType(file.FileName), FileName = file.FileName, FileGuid = guid, FileCategoryId = fileCategory, Alt = alt, LanguageId = _localizationService.GetCurrentLanguageId(), Title = saveFileToDatabaseResult.Data.Title } } };

                        }
                    }

                }
                result.Data = saveResult;
                result.AddErrors(saveFileResult.Errors);
                if (saveFileResult.IsFailed)
                {
                    result.Fail();
                }
                return result;
            }
            return null;
        }

        public async Task<List<CreateFileCommandResponse>?> SaveFileSetAsync(List<IFormFile>? fileSet, int languageId)
        {
            List<CreateFileCommandResponse> fileSetList = new List<CreateFileCommandResponse>();
            if (fileSet == null) return fileSetList;
            foreach (var file in fileSet)
            {
                if (file is { Length: > 0 })
                {
                    // Process the file
                    Guid guid = Guid.NewGuid();
                    using var memoryStream = new MemoryStream();
                    file.CopyTo(memoryStream);
                    byte[] fileBytes = memoryStream.ToArray();
                    var saveFile = await _fileService.SaveFile(fileBytes, file.FileName, guid.ToString());
                    //      var saveResult = await _mediator.Send(new CreateFileCommand
                    //         { FileExtension = file.ContentType, FileName = file.FileName, FileGuid = guid });
                    var file1 = new CreateFileCommandResponse { Data = new CreateFileDto { FileGuid = guid, FileExtension = _fileService.GetMimeType(file.FileName), FileName = file.FileName, LanguageId = languageId } };
                    file1.AddErrors(saveFile.Errors);
                    if (saveFile.IsFailed)
                    {
                        file1.AddErrors(saveFile.Errors);
                        file1.Fail();
                    }
                    fileSetList.Add(file1);
                }
            }

            return fileSetList;
        }

        public async Task<CreateFileCommandResponse> SaveFileSetAsync(IFormFile fileToBeSaved, int languageId)
        {
            CreateFileCommandResponse fileSet = new CreateFileCommandResponse();

            if (fileToBeSaved is { Length: > 0 })
            {
                // Process the file
                Guid guid = Guid.NewGuid();
                using var memoryStream = new MemoryStream();
                fileToBeSaved.CopyTo(memoryStream);
                byte[] fileBytes = memoryStream.ToArray();
                var saveFile = await _fileService.SaveFile(fileBytes, fileToBeSaved.FileName, guid.ToString());
                //      var saveResult = await _mediator.Send(new CreateFileCommand
                //         { FileExtension = file.ContentType, FileName = file.FileName, FileGuid = guid });
                var file1 = new CreateFileCommandResponse { Data = new CreateFileDto { FileGuid = guid, FileExtension = _fileService.GetMimeType(fileToBeSaved.FileName), FileName = fileToBeSaved.FileName, LanguageId = languageId } };
                if (saveFile.IsFailed)
                {
                    file1.AddErrors(saveFile.Errors);
                    file1.Fail();
                }
                fileSet = file1;
            }

            return fileSet;
        }

        public async Task<List<CreateFileCommandResponse>?> SaveFileSetAsync(List<ExtendedFile>? fileSet, int languageId)
        {
            List<CreateFileCommandResponse> fileSetList = new List<CreateFileCommandResponse>();
            if (fileSet == null) return fileSetList;
            foreach (var file in fileSet)
            {
                if (file?.File?.Length > 0)
                {
                    // Process the file
                    Guid guid = Guid.NewGuid();
                    using var memoryStream = new MemoryStream();
                    file.File.CopyTo(memoryStream);
                    byte[] fileBytes = memoryStream.ToArray();
                    var saveFile = await _fileService.SaveFile(fileBytes, file.File.FileName, guid.ToString());
                    //      var saveResult = await _mediator.Send(new CreateFileCommand
                    //         { FileExtension = file.ContentType, FileName = file.FileName, FileGuid = guid });
                    var file1 = new CreateFileCommandResponse { Data = new CreateFileDto { FileGuid = guid, FileExtension = _fileService.GetMimeType(file.File.FileName), FileName = file.File.FileName, LanguageId = languageId, Alt = file.Alt, FileCategoryId = file.Category, Title = file.Title } };
                    if (saveFile.IsFailed)
                    {
                        file1.AddErrors(saveFile.Errors);
                        file1.Fail();
                    }
                    fileSetList.Add(file1);
                }
            }

            return fileSetList;
        }
    }
}
