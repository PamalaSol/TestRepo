using Mapster;
using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Features.Posts.Commands.CreatePost;
using CleanArchFramework.Application.Features.Posts.Commands.UpdatePost;
using CleanArchFramework.Application.Features.Posts.Query.GetAllPost;
using CleanArchFramework.Application.Features.Posts.Query.GetPost;
using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Application.Profiles
{
    internal class PostMappings : IRegister
    {
        void IRegister.Register(TypeAdapterConfig config)
        {
            var helper = new SharedMappingHelper();
            config.NewConfig<CreatePostCommand, Post>()
                .Map(dest => dest.Name, src => helper.MapToTranslation(src.Name))
                .Map(dest => dest.Description, src => helper.MapToTranslation(src.Description))
                .Map(dest => dest.Content, src => helper.MapToTranslation(src.Content))
                ;

            config.NewConfig<UpdatePostCommand, Post>()
                .Map(dest => dest.Categories, src => src.Categories)
                .Map(dest => dest.Tags, src => src.Tags)
                .Ignore(dest => dest.Name, src => src.Name)
                .Ignore(dest => dest.Description, src => src.Description)
                .Ignore(dest => dest.Content, src => src.Content)

                .AfterMapping((src, dest) => // This is the AfterMap part
                {
                    // Perform actions after the mapping is done
                    dest.Name.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.Name ?? "";
                    dest.Content.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.Content ?? "";
                    dest.Description.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.Description ?? "";
                });

            config.NewConfig<Post, CreatePostDto>()
                .Map(dest => dest.Name, src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Content, src => helper.MapFromTranslation(src.Content))
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description)).Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image))
                .MaxDepth(2);

            config.NewConfig<Post, GetPostDto>()
                .Map(dest => dest.Name, src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Content, src => helper.MapFromTranslation(src.Content))
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description)).Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                    .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image))
                    .MaxDepth(2);

            config.NewConfig<Post, GetAllPostDto>()
                    .Map(dest => dest.Name, src => helper.MapFromTranslation(src.Name))
                    .Map(dest => dest.Content, src => helper.MapFromTranslation(src.Content))
                    .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
                    //       .Map(dest => dest.Categories, src => src.Categories.Any(x=>x.).FirstOrDefault(x => x.LanguageId == MapContext.Current.GetService<ILocalizationService>().GetCurrentLanguageId())!.Value)
                    .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                    .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image))
                    .MaxDepth(2);

            config.NewConfig<Post, UpdatePostDto>()
                .Map(dest => dest.Name, src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Content, src => helper.MapFromTranslation(src.Content))
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description)).MaxDepth(2);


        }

    }

}
