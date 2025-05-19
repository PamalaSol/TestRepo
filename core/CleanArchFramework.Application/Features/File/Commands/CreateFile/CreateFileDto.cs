namespace CleanArchFramework.Application.Features.File.Commands.CreateFile
{
    public class CreateFileDto
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string FileName { get; set; }
        public string? Alt { get; set; }
        public Guid FileGuid { get; set; }
        public string FileExtension { get; set; }
        public int? LanguageId {get; set; }
        public int? FileCategoryId { get; set; }
    }
}
