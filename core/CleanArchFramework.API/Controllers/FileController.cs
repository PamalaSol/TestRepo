using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Features.File.Commands.DeleteFile;
using Microsoft.AspNetCore.Mvc;
using CleanArchFramework.Application.Features.File.Query.GetFile;
using CleanArchFramework.Application.Features.File.Query.GetFilesByCategory;
using CleanArchFramework.Application.Shared.FileHelper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.API.Helper;
using CleanArchFramework.Application.Shared.Options;

namespace CleanArchFramework.API.Controllers
{
    [Route("api/")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IMediator _mediator;
        private readonly FileHelper _fileHelper;
        private readonly FileTypeHelper _fileTypeHelper;
        public FileController(IFileService fileService, IMediator mediator, FileHelper fileHelper, FileTypeHelper fileTypeHelper)
        {
            _fileService = fileService;
            _mediator = mediator;
            _fileHelper = fileHelper;
            _fileTypeHelper = fileTypeHelper;
        }

        [HttpGet("files/{fileId}/{fileName?}")]
        public async Task<IActionResult> DownloadFilesSecure(Guid fileId, string? fileName)
        {
            var file = await _mediator.Send(new GetFileQuery { Id = fileId });
            var fileStream = await _fileService.GetFile(file.Data.FileGuid.ToString());
            if (fileStream?.Length > 0)
            {

                if (_fileTypeHelper.IsInlineSupported(file.Data.FileExtension))
                {
                    Response.Headers.Add("Content-Disposition", "inline;filename=" + _fileHelper.GenerateFileName(file.Data));
                    return File(fileStream, file.Data.FileExtension);
                }
                else
                {
                    return File(fileStream, file.Data.FileExtension, _fileHelper.GenerateFileName(file.Data));
                }
            }
            return NotFound();
        }
        [HttpGet("file/{fileId}")]
        public async Task<IActionResult> DownloadFileInfo(Guid fileId)
        {
            var file = await _mediator.Send(new GetFileQuery { Id = fileId });
            if (file.Data == null)
            {
                return NoContent();
            }
            return Ok(file);
        }

        [HttpGet("files")]
        public async Task<IActionResult> GetFilesByCategory([FromQuery] List<int> categories, [FromQuery] QueryOptions queryOptions)
        {
            var file = await _mediator.Send(new GetFilesByCategoryQuery() { Id = categories, QueryOptions = queryOptions });

            if (file.Data == null)
            {
                return NoContent();
            }
            return Ok(file);
        }

        [HttpPost("files")]
        public async Task<IActionResult> AddFile(IFormFile file, int category, string? alt, string? title)
        {
            var result = await _fileHelper.CreateFileAsync(file, alt, false, category, true, fileTitle: title);

            return Ok(result);
        }
        [HttpDelete("files/{fileId}/{fileName?}")]
        [Authorize(Roles = "Superadmin,Admin")]
        //TODO CHECK IF USER CAN DELETE AN IMAGE/FILE!
        public async Task<IActionResult> DeleteFilesSecure(Guid fileId, string? fileName)
        {
            var file = await _mediator.Send(new GetFileQuery { Id = fileId });
            if (file is { Data: not null, IsSuccessful: true })
            {
                var deleteFileDb = await _mediator.Send(new DeleteFileCommand { Id = fileId });
                if (deleteFileDb.IsSuccessful)
                {
                    await _fileService.DeleteFileAsync(file.Data.FileGuid.ToString());

                    return Ok($"File {file.Data.FileName} deleted!");
                }
                else
                {
                    throw new Exception("Internal server error!");
                }

            }
            return NotFound();
        }


        [HttpDelete("multifiles")]
        [Authorize(Roles = "Superadmin,Admin")]
        public async Task<ActionResult<Result>> DeleteMultipleFilesSecure(List<Guid> fileIds)
        {
            Result result = new Result();
            foreach (var fileId in fileIds)
            {
                var deleteFileDb = await _mediator.Send(new DeleteFileCommand { Id = fileId });
                if (deleteFileDb.IsSuccessful)
                {
                    await _fileService.DeleteFileAsync(deleteFileDb.Data.FileGuid.ToString());
                    result.Succeed();
                    if (deleteFileDb.IsSuccessful)
                    {
                        result.WithMessage(result.Message + "\n" +
                                           $"File {deleteFileDb.Data.FileName} deleted!");
                    }
                    else
                    {
                        result.Fail();
                        result.WithError($"Error deleting file: {deleteFileDb.Data.FileName}");
                        return BadRequest(result);
                    }

                }
                else { return BadRequest(deleteFileDb.Errors); }
            }

            return Ok();
        }

        //[HttpGet("files/{fileId}/{fileName}")]
        //public async Task<IActionResult> DownloadFiles(string fileId, string fileName)
        //{
        //    var fileStream = await _fileService.GetFile(fileId);
        //    if (fileStream.Length > 0)
        //    {
        //        return File(fileStream, "application/octet-stream", fileName);
        //    }
        //    return NotFound();
        //}

        //[HttpGet("images/{fileId}/{fileName}")]
        //public IActionResult DownloadImages(string fileId, string fileName)
        //{
        //    var fileStream =  _fileService.GetFileStream(fileId);
        //    if (fileStream.Length > 0)
        //    {
        //        return File(fileStream, "application/octet-stream", fileName);
        //    }
        //    return NotFound();
        //}

    }
}
