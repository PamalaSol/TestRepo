namespace CleanArchFramework.API.Helper
{
    public class FileTypeHelper
    {
        public static readonly HashSet<string> InlineSupportedMimeTypes = new HashSet<string>
    {
        "application/pdf",  // PDF
        "image/jpeg",       // JPEG Image
        "image/png",        // PNG Image
        "image/gif",        // GIF Image
        "image/svg+xml",    // SVG Image
        "image/webp",       // WebP Image
        "text/plain",       // Plain Text
        "text/html",        // HTML
        "application/xml",  // XML
        "application/json", // JSON
        "audio/mpeg",       // MP3 Audio
        "audio/wav",        // WAV Audio
        "audio/ogg",        // Ogg Audio
        "video/mp4",        // MP4 Video
        "video/webm",       // WebM Video
        "video/ogg"         // Ogg Video
    };

        // Method to check if the file can be displayed inline based on its MIME type
        public bool IsInlineSupported(string mimeType)
        {
            return InlineSupportedMimeTypes.Contains(mimeType.ToLower());
        }



        // Helper function to get the MIME type based on the file extension
        public string GetMimeType(string filePath)
        {
            var extension = Path.GetExtension(filePath).ToLowerInvariant();
            return extension switch
            {
                ".pdf" => "application/pdf",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".svg" => "image/svg+xml",
                ".webp" => "image/webp",
                ".txt" => "text/plain",
                ".html" => "text/html",
                ".xml" => "application/xml",
                ".json" => "application/json",
                ".mp3" => "audio/mpeg",
                ".wav" => "audio/wav",
                ".ogg" when IsAudioFile(filePath) => "audio/ogg",
                ".mp4" => "video/mp4",
                ".webm" => "video/webm",
                ".ogg" when IsVideoFile(filePath) => "video/ogg",
                _ => "application/octet-stream"  // Default for unsupported files
            };
        }

        // Helper to determine if .ogg is an audio or video file (for distinguishing MIME types)
        public bool IsAudioFile(string filePath) => filePath.EndsWith(".ogg", StringComparison.OrdinalIgnoreCase) && new[] { ".mp3", ".wav", ".ogg" }.Contains(Path.GetExtension(filePath));

        public bool IsVideoFile(string filePath) => filePath.EndsWith(".ogg", StringComparison.OrdinalIgnoreCase) && new[] { ".mp4", ".webm", ".ogg" }.Contains(Path.GetExtension(filePath));
    }
}
