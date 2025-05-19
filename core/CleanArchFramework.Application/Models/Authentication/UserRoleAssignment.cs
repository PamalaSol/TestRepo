namespace CleanArchFramework.Application.Models.Authentication;

public class UserRoleAssignment
{
    public string Username { get; set; }
    public List<string> Roles { get; set; }
}