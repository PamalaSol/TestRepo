using CleanArchFramework.Application.Features.File.Query.GetFile;

namespace CleanArchFramework.Application.Features.File.Query.GetFilesByCategory
{
    public sealed class GetFilesDto
    {
        public List<GetFileDto>? Files { get; set; }
    }
}
