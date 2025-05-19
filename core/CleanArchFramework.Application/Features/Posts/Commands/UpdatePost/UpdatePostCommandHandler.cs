using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.FileHelper;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using MapsterMapper;
using MediatR;

namespace CleanArchFramework.Application.Features.Posts.Commands.UpdatePost
{
    public class UpdatePostCommandHandler : IRequestHandler<UpdatePostCommand, UpdatePostCommandResponse>
    {
        private readonly IPostRepository _postRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILocalizationService _localizationService;
        private readonly ICategoryRepository _categoryRepository;
 
        private readonly ITagRepository _tagRepository;
        private readonly FileHelper _fileHelper;
        public UpdatePostCommandHandler(IMapper mapper, IPostRepository postRepository, IUnitOfWork unitOfWork, ILocalizationService localizationService, ICategoryRepository categoryRepository, ITagRepository tagRepository, FileHelper fileHelper)
        {
            _mapper = mapper;
            _postRepository = postRepository;
            _unitOfWork = unitOfWork;
            _localizationService = localizationService;
            _categoryRepository = categoryRepository;
            _tagRepository = tagRepository;
            _fileHelper = fileHelper;
        }

        public async Task<UpdatePostCommandResponse> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
        {
            var updatePostCommandResponse = new UpdatePostCommandResponse();

            var validator = new UpdatePostCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                updatePostCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    updatePostCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                var localization = _localizationService.GetCurrentLanguageId();
                var postToUpdate = await _postRepository.GetFirstAsync(x => x.Id == request.Id
                                                                            && x.Name.Localizations.Any(z => z.LanguageId == localization)
                    && x.Content.Localizations.Any(z => z.LanguageId == localization)
                    && x.Description.Localizations.Any(z => z.LanguageId == localization));
                updatePostCommandResponse.Succeed();

                var allCategories = await _categoryRepository.GetAllAsync(x => request.Categories != null && request.Categories.Contains(x.Id));
                var allTags = await _tagRepository.GetAllAsync(x => request.Tags != null && request.Tags.Contains(x.Id));

                postToUpdate.Categories = new List<Domain.Entities.Category>();
                postToUpdate.Tags = new List<Domain.Entities.Tag>();

         
                var postImage = await _fileHelper.CreateFileAsync(request.Image, request.Alt);
                List<FileStorage> listImages = new List<FileStorage>();

                if (postImage != null && postImage.IsFailed)
                {
                    updatePostCommandResponse.AddErrors(postImage.Errors);
                }
                else
                {
                    if (postImage != null)
                    {
                        var postImg = postImage.Data.Files.FirstOrDefault(x => x.LanguageId == localization);
                     //   var postImgMapped = _mapper.Map<FileStorage>(postImg);
                        listImages.Add(postImg);
                    }
                }

                if (postToUpdate?.Image.Files != null)
                {
                    foreach (var f in postToUpdate.Image?.Files)
                    {
                        if (f.LanguageId != localization)
                        {
                            listImages.Add(f);
                        }

                        if (postImage == null && request.Alt != null && f.LanguageId == localization)
                        {
                            f.Alt = request.Alt;
                            listImages.Add(f);
                        }
                    }
                }
                var mapped = _mapper.Map(request, postToUpdate);
                mapped.Image = new FileSet { Files = listImages };
                var post = await _postRepository.UpdateAsync(mapped);

                mapped.Categories = new List<Domain.Entities.Category>(allCategories);

                mapped.Tags = new List<Domain.Entities.Tag>(allTags);

                await _unitOfWork.SaveAsync(cancellationToken);

                updatePostCommandResponse.Data = _mapper.Map<UpdatePostDto>(post);
                updatePostCommandResponse.Data.DataImage = await _fileHelper.GetBase64String(post.Image);
            }

            return updatePostCommandResponse;
        }
    }
}
