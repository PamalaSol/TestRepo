namespace CleanArchFramework.Application.Features.Faq.Query.GetAllFaq
{
    public sealed class GetAllFaqDto
    {
        public int Id { get; set; }
        public required string Question { get; set; }
        public required string Answer { get; set; }
        public bool IsPublished { get; set; }
        public bool IsPromoted { get; set; }

        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
