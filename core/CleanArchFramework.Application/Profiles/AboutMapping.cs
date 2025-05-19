using CleanArchFramework.Application.Features.About.Command.CreateAbout;
using CleanArchFramework.Application.Features.About.Command.UpdateAbout;
using CleanArchFramework.Application.Features.About.Query.GetAbout;
using CleanArchFramework.Domain.Entities;
using Mapster;

namespace CleanArchFramework.Application.Profiles
{
    internal class AboutMapping : IRegister
    {
        //About
        void IRegister.Register(TypeAdapterConfig config)
        {
            var helper = new SharedMappingHelper();

            config.NewConfig<About, GetAboutDto>()
                .Map(dest => dest.Title, src => helper.MapFromTranslation(src.Title))
                .Map(dest => dest.InfoText, src => helper.MapFromTranslation(src.InfoText))
                .Map(dest => dest.Subtitle, src => helper.MapFromTranslation(src.Subtitle))
                .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                    .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image));

            config.NewConfig<About, CreateAboutDto>()
                .Map(dest => dest.Title, src => helper.MapFromTranslation(src.Title))
                .Map(dest => dest.InfoText, src => helper.MapFromTranslation(src.InfoText))
                .Map(dest => dest.Subtitle, src => helper.MapFromTranslation(src.Subtitle))
                .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image));

            config.NewConfig<About, UpdateAboutDto>()
                .Map(dest => dest.Title, src => helper.MapFromTranslation(src.Title))
                .Map(dest => dest.InfoText, src => helper.MapFromTranslation(src.InfoText))
                .Map(dest => dest.Subtitle, src => helper.MapFromTranslation(src.Subtitle))
                .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image));

            config.NewConfig<CreateAboutCommand, About>()
                .Map(dest => dest.Title, src => helper.MapToTranslation(src.Title))
                .Map(dest => dest.InfoText, src => helper.MapToTranslation(src.InfoText))
                .Map(dest => dest.Subtitle, src => helper.MapToTranslation(src.Subtitle));

            config.NewConfig<UpdateAboutCommand, About>()
                    .Ignore(dest => dest.Title, src => src.Title)
                        .Ignore(dest => dest.InfoText, src => src.InfoText)
                    .Ignore(dest => dest.Subtitle, src => src.Subtitle)
                    .AfterMapping((src, dest) => // This is the AfterMap part
                    {
                        // Perform actions after the mapping is done
                        dest.Title.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.Title;
                        dest.InfoText.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.InfoText;
                        dest.Subtitle.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.InfoText;
                    });
        }

    }
}
