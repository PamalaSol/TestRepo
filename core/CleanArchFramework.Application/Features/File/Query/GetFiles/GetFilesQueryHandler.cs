using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.File.Query.GetFile
{
    public sealed class GetFilesQueryHandler : IRequestHandler<GetFilesQuery, Result<GetFilesDto>>
    {
        private readonly IFileStorageRepository _fileRepository;
        private readonly IMapper _mapper;

        public GetFilesQueryHandler(IMapper mapper, IFileStorageRepository fileRepository)
        {
            _mapper = mapper;
            _fileRepository = fileRepository;
        }

        public async Task<Result<GetFilesDto>> Handle(GetFilesQuery request, CancellationToken cancellationToken)
        {
            var allFile = await _fileRepository.GetAllAsync(x=> request.Id.Contains(x.Id));
            var result = new Result<GetFilesDto>();
            result.Data = _mapper.Map<GetFilesDto>(allFile);
            result.Succeed();
            return result;
        }
    }
}
