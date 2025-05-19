namespace CleanArchFramework.Application.Shared.Result
{
    public class Result : IResult
    {
        private List<IResultError> _errors = new List<IResultError>();
        public Result()
        {
            IsSuccessful = true;
        }
        /// <summary>
        /// A collection of errors from the result
        /// </summary>
        public IReadOnlyCollection<IResultError> Errors => _errors.AsReadOnly();

        /// <summary>
        /// An indication whether the result has failed
        /// </summary>
        public bool IsFailed => !IsSuccessful;

        /// <summary>
        /// The result message
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Metadata which might be contained in the result
        /// </summary>
        public Dictionary<string, object> Metadata { get; internal set; } = new Dictionary<string, object>();

        /// <summary>
        /// Helper proper to present the message with errors
        /// </summary>
        public string MessageWithErrors => $"{Message}{Environment.NewLine}{string.Join(',', _errors)}";

        /// <summary>
        /// An indication whether the result is successful
        /// </summary>
        public bool IsSuccessful { get; internal set; }
   

        /// <summary>
        /// Helper for adding error with message to result object
        /// </summary>
        /// <param name="errorMessage"></param>
        public void AddError(string errorMessage)
        {
            _errors.Add(new ResultError(errorMessage));
        }

        /// <summary>
        /// Helper for adding multiple errors
        /// </summary>
        /// <param name="errors"></param>
        public void AddErrors(IEnumerable<IResultError> errors)
        {
            _errors.AddRange(errors);
        }
        /// <summary>
        /// Helper function for adding error with message and <paramref name="errorCode"/>
        /// </summary>
        /// <param name="errorMessage"></param>
        /// <param name="errorCode"></param>
        public void AddError(string errorMessage, string errorCode)
        {
            _errors.Add(new ResultError(errorMessage, errorCode));
        }
    }

    /// <summary>
    /// Generic result wrapper. See <see cref="Result"/>, see <see cref="IResult{T}"/>
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Result<T> : Result, IResult<T>
    {
        public Result() : base()
        {
        }

        public T Data { get; set; }
      
    }
}
