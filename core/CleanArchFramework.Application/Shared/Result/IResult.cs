namespace CleanArchFramework.Application.Shared.Result
{
    public interface IResult
    {
        IReadOnlyCollection<IResultError> Errors { get; }
        bool IsSuccessful { get; }
        string Message { get; set; }

    }
    public interface IResult<out T> : IResult
    {
        T Data { get; }
    }
}
