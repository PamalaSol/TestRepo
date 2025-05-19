namespace CleanArchFramework.Application.Features.Product.Query.GetProductsByCategory
{
    public  class ProductFileDto
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string FileName { get; set; } //Whole name, and extension
        public string? Alt { get; set; }
        public int? LanguageId { get; set; }
        public int? FileCategoryId { get; set; }
        //public Guid FileGuid { get; set; }
        //public string FileExtension { get; set; }
    }
}
