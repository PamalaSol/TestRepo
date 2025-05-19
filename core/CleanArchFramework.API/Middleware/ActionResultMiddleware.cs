using CleanArchFramework.Application.Shared.Result;

using Microsoft.AspNetCore.Mvc;

namespace CleanArchFramework.API.Middleware
{
        public class ActionResultMiddleware<T> : ObjectResult
        {
            public ActionResultMiddleware(Result<T> result) : base(result)
            {
             //   SetStatusCode(result.Code);
            }

            private void SetStatusCode(int code)
            {
                switch (code)
                {
                    case 200:
                        StatusCode = 200;
                        break;
                    case 201:
                        StatusCode = 201;
                        break;
                    case 204:
                        StatusCode = 204;
                        break;
                    case 404:
                        StatusCode = 404;
                        break;
                // Add more cases as needed
                default:
                        StatusCode = 200; // Default to Internal Server Error
                        break;
                }
            }
        }
    }
