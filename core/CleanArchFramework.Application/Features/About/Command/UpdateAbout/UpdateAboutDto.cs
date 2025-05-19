namespace CleanArchFramework.Application.Features.About.Command.UpdateAbout
{
    public class UpdateAboutDto
    {
        public int Id { get; set; }
        public Guid? ImageId { get; set; }
        public string? DataImage { get; set; }
        //public Guid? BackgroundImageId { get; set; }
        //public string? DataBackgroundImage { get; set; }
        public string? Alt { get; set; }
        public string? Title { get; set; }
        public string? Subtitle { get; set; }
        public string? InfoText { get; set; }

        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
