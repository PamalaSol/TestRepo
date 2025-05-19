using CleanArchFramework.Application.Shared.Result;
using Microsoft.Extensions.Logging;

namespace CleanArchFramework.Application.Shared
{
    /// <summary>
    /// Service result helper. See <see cref="IResult"/>, <see cref="IResult{T}"/>
    /// </summary>
    public static class ServicesHelper
    {
        public static void HandleServiceError<T, P>(ref Result<T> serviceResult, ILogger<P> logger, Exception ex, string uiErrorMessage)
        {
            logger.LogError($"{nameof(HandleServiceError)}: {ex}");
            if (serviceResult.Errors.Any())
            {
                logger.LogError($"Result errors: {string.Join(Environment.NewLine, serviceResult.Errors)}");
            }
            serviceResult
                .Fail()
                .WithMessage(uiErrorMessage)
               // .WithException(ex)
                .WithData(default);
        }

        public static void HandleServiceError<P>(ref Application.Shared.Result.Result serviceResult, ILogger<P> logger, Exception ex, string uiErrorMessage)
        {
            logger.LogError($"{nameof(HandleServiceError)}: {ex}");
            if (serviceResult.Errors.Any())
            {
                logger.LogError($"Result errors: {string.Join(Environment.NewLine, serviceResult.Errors)}");
            }
            serviceResult
                .Fail()
                //.WithException(ex)
                .WithMessage(uiErrorMessage);
        }

        public static void HandleServiceError<P,T>(ref PagedResult<T> serviceResult, ILogger<P> logger, Exception ex, string uiErrorMessage) where T : class
        {
            logger.LogError($"{nameof(HandleServiceError)}: {ex}");
            if (serviceResult.Errors.Any())
            {
                logger.LogError($"Result errors: {string.Join(Environment.NewLine, serviceResult.Errors)}");
            }
            serviceResult
                .Fail()
                //.WithException(ex)
                .WithMessage(uiErrorMessage);
        }
    }
}
