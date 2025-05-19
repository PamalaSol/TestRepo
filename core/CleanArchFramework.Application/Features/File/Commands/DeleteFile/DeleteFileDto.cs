namespace CleanArchFramework.Application.Features.File.Commands.DeleteFile
{
    public class DeleteFileDto
    {
        public Guid Id { get; set; }
        public required Guid FileGuid { get; set; }
        public string FileName { get; set; }
    }
}
