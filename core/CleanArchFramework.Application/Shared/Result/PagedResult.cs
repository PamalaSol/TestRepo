namespace CleanArchFramework.Application.Shared.Result
{
    public class PagedResultBase : IResult
    {
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }
        public int CurrentRecords { get; set; }
        public Uri FirstPage { get; set; }
        public Uri LastPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalRecords { get; set; }
        public Uri NextPage { get; set; }
        public Uri PreviousPage { get; set; }
        public IReadOnlyCollection<IResultError> Errors { get; }
        public bool IsSuccessful { get; set; }
        public string Message { get; set; }
        /// <summary>
        /// An indication whether the result has failed
        /// </summary>
        public bool IsFailed => !IsSuccessful;
    }

    public class PagedResult<T> : PagedResultBase where T : class
    {
        public IList<T> Data { get; set; }

        public PagedResult()
        {
            Data = new List<T>();
        }

    }
}
