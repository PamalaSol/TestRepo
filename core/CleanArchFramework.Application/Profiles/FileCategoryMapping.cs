using Mapster;
using CleanArchFramework.Application.Features.FileCategory.Command.CreateFileCategory;
using CleanArchFramework.Application.Features.FileCategory.Command.UpdateFileCategory;
using CleanArchFramework.Application.Features.FileCategory.Query.GetAllFileCategory;
using CleanArchFramework.Application.Features.FileCategory.Query.GetFileCategory;
using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Application.Profiles
{
    internal class FileCategoryMapping : IRegister
    {
        void IRegister.Register(TypeAdapterConfig config)
        {
            var helper = new SharedMappingHelper();
            config.NewConfig<FileCategory, GetFileCategoryDto>()
                .Map(dest => dest.Name, src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Description,src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image));

            config.NewConfig<FileCategory, GetAllFileCategoryDto>()
                .Map(dest => dest.Name, src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image))
                .IgnoreNullValues(true);

            config.NewConfig<FileCategory, CreateFileCategoryDto>()
                .Map(dest => dest.Name, src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image));

            config.NewConfig<FileCategory, UpdateFileCategoryDto>().Map(dest => dest.Name, src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image));
            config.NewConfig<CreateFileCategoryCommand, FileCategory>()
                .Map(dest => dest.Name, src => helper.MapToTranslation(src.Name))
                .Map(dest => dest.Description, src => helper.MapToTranslation(src.Description));
            //     .Map(dest => dest.ParentFileCategoryId, src => src.ParentFileCategoryId);
            config.NewConfig<UpdateFileCategoryCommand, FileCategory>()
                .Ignore(dest => dest.Name, src => src.Name)
                .Ignore(dest => dest.Description, src => src.Description)
                .AfterMapping((src, dest) => // This is the AfterMap part
                {
                    // Perform actions after the mapping is done
                    dest.Name.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.Name;
                    dest.Description.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.Description;
                });
        }
       
    }
}
