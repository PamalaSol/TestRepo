using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.About.Query.GetAbout
{
    public sealed class GetAboutQueryHandler : IRequestHandler<GetAboutQuery, Result<GetAboutDto>>
    {
        private readonly IAboutRepository _aboutRepository;
        private readonly IMapper _mapper;
  
        private readonly FileHelper _fileHelper;
        public GetAboutQueryHandler(IMapper mapper, IAboutRepository aboutRepository, FileHelper fileHelper)
        {
            _mapper = mapper;
            _aboutRepository = aboutRepository;
   
            _fileHelper = fileHelper;
        }

        public async Task<Result<GetAboutDto>> Handle(GetAboutQuery request, CancellationToken cancellationToken)
        {
            var getAbout = await _aboutRepository.GetFirstAboutAsync();
            var result = new Result<GetAboutDto>();
            result.Data = _mapper.Map<GetAboutDto>(getAbout);
            result.Data.DataImage =
                await _fileHelper.GetBase64String(getAbout?.Image);
            result.Succeed();
            return result;
        }
    }
}
