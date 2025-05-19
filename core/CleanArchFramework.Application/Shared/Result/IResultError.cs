namespace CleanArchFramework.Application.Shared.Result
{
    public interface IResultError
    {
        string Code { get; }
        string Error { get; }

    }
}
