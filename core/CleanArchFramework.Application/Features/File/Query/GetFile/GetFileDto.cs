namespace CleanArchFramework.Application.Features.File.Query.GetFile
{
    public sealed class GetFileDto
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string FileName { get; set; }
        public Guid FileGuid { get; set; }
        public string FileExtension { get; set; }
        public string? Alt { get; set; }
        public int? FileCategoryId { get; set; }
        public int? LanguageId { get; set; }
    }
}
