namespace CleanArchFramework.Application.Models.Authentication;

public class User
{
    public Guid? ProfilePictureId { get; set; }
   // public string? DataProfileBackground { get; set; }
    public string Name { get; set; }
    public string LastName { get; set; }
    //  public string? UserName { get; set; }
    public string? Email { get; set; }
    public List<string> Roles { get; set; }
    public decimal? Deposit { get; set; }
    public string Id { get; set; }

}