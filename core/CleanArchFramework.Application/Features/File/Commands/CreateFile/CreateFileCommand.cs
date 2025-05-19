using MediatR;

namespace CleanArchFramework.Application.Features.File.Commands.CreateFile
{
    public class CreateFileCommand : IRequest<CreateFileCommandResponse>
    {
        public required string FileName { get; set; }
        public required Guid FileGuid { get; set; }
        public required string FileExtension { get; set; }
        public string? Alt { get; set; }
        public int? FileCategoryId { get; set; }
        public string? Title {get; set; }
        public int LanguageId { get; set; }
    }
    
}
