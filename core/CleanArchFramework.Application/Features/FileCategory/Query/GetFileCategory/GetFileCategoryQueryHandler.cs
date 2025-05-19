using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.FileCategory.Query.GetFileCategory
{
    public sealed class GetFileCategoryQueryHandler : IRequestHandler<GetFileCategoryQuery, Result<GetFileCategoryDto>>
    {
        private readonly IFileCategoryRepository _fileCategoryRepository;
        private readonly IMapper _mapper;
        private readonly FileHelper _fileHelper;
        public GetFileCategoryQueryHandler(IMapper mapper, IFileCategoryRepository fileCategoryRepository, FileHelper fileHelper)
        {
            _mapper = mapper;
            _fileCategoryRepository = fileCategoryRepository;
           _fileHelper = fileHelper;

        }

        public async Task<Result<GetFileCategoryDto>> Handle(GetFileCategoryQuery request, CancellationToken cancellationToken)
        {
            var fileCategory = await _fileCategoryRepository.GetFirstNoTrackingAsync(x=>x.Id == request.Id);
            var result = new Result<GetFileCategoryDto>();
            result.Data = _mapper.Map<GetFileCategoryDto>(fileCategory);
            result.Data.DataImage = await _fileHelper.GetBase64String(fileCategory.Image);
            result.Succeed();
            return result;
        }
    }
}
