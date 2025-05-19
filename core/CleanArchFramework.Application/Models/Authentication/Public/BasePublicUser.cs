namespace CleanArchFramework.Application.Models.Authentication.Public;

public abstract class BasePublicUser
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string LastName { get; set; }
    public string? Social { get; set; }
    public string? Website { get; set; }
    public string? Info { get; set; } //Main Description

    public Guid? ProfilePictureId { get; set; }
    public string? DataProfilePicture { get; set; }
    //public Guid? ProfilePictureId { get; set; }
    //public string? DataProfileBackground { get; set; }

}