using CleanArchFramework.Domain.Common;

namespace CleanArchFramework.Domain.Entities
{
    public class FileStorage : BaseEntity<Guid>
    {
        public string? Title { get; set; }
        public required string FileName { get; set; }
        public required Guid FileGuid { get; set; }
        public required string FileExtension { get; set; }
        public string? Alt { get; set; }
        public virtual Guid? FileSetId { get; set; }
        public virtual FileSet? FileSet { get; set; }
        public int LanguageId { get; set; }
        public virtual Language Language { get; set; }

        public virtual FileCategory? FileCategory { get; set; }
        public virtual int? FileCategoryId { get; set; }
    }
}
