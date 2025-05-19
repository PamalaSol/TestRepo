namespace CleanArchFramework.Infrastructure.Infrastructure.FileService
{
    public sealed class FileOptions
    {
        /// <summary>
        /// Storage Location.
        /// </summary>
        public string StorageLocation { get; init; }

        public int MaxFileSize { get; set; }
    }
}

