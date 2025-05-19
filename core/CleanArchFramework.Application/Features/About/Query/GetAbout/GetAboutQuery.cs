using CleanArchFramework.Application.Shared.Result;
using MediatR;

namespace CleanArchFramework.Application.Features.About.Query.GetAbout
{
    public class GetAboutQuery : IRequest<Result<GetAboutDto>>
    {
   
    }
}
