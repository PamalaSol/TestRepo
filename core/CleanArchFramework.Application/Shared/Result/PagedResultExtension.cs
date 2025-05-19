namespace CleanArchFramework.Application.Shared.Result
{
    public static class PagedResultExtensions
    {
            public static PagedResult<T> Succeed<T>(this PagedResult<T> instance) where T : class
            {
                instance.IsSuccessful = true;
                return instance;
            }
            public static PagedResult<T> Fail<T>(this PagedResult<T> instance) where T : class
            {
                instance.IsSuccessful = false;
                return instance;
            }
            public static PagedResult<T> WithMessage<T>(this PagedResult<T> instance, string message) where T : class
            {
                instance.Message = message;
                return instance;
            }
            public static PagedResult<T> GetPaged<T, T2>(this PagedResult<T> instance, IQueryable<T2> query,
                int page, int pageSize) where T : class
            {

                instance.CurrentPage = page;
                instance.PageSize = pageSize;
                instance.TotalRecords = query.Count();

                var pageCount = (double)instance.TotalRecords / pageSize;
                instance.TotalPages = (int)Math.Ceiling(pageCount);

                //var skip = (page - 1) * pageSize;
                instance.Data = instance.Data;

                return instance;
            }

        }
    }

