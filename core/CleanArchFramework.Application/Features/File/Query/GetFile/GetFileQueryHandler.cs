using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.File.Query.GetFile
{
    public sealed class GetFileQueryHandler : IRequestHandler<GetFileQuery, Result<GetFileDto>>
    {
        private readonly IFileStorageRepository _fileRepository;
        private readonly IMapper _mapper;

        public GetFileQueryHandler(IMapper mapper, IFileStorageRepository fileRepository)
        {
            _mapper = mapper;
            _fileRepository = fileRepository;
        }

        public async Task<Result<GetFileDto>> Handle(GetFileQuery request, CancellationToken cancellationToken)
        {
            var allFile = await _fileRepository.GetFirstAsync(x => x.Id == request.Id);
            var result = new Result<GetFileDto>();
            result.Data = _mapper.Map<GetFileDto>(allFile);
            result.Succeed();
            return result;
        }
    }
}
