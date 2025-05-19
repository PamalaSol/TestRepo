using CleanArchFramework.Application.Features.Category.Command.CreateCategory;
using CleanArchFramework.Application.Features.Category.Command.UpdateCategory;
using CleanArchFramework.Application.Features.Category.Query.GetAllCategory;
using CleanArchFramework.Application.Features.Category.Query.GetCategory;
using CleanArchFramework.Domain.Entities;
using Mapster;

namespace CleanArchFramework.Application.Profiles
{
    internal class CategoryMapping : IRegister
    {
        void IRegister.Register(TypeAdapterConfig config)
        {
            var helper = new SharedMappingHelper();

            config.NewConfig<Category, GetCategoryDto>()
         .Map(dest => dest.Name, src => helper.MapFromTranslation(src.Name))
         .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
         .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
         .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image))
         .IgnoreNullValues(true);

            config.NewConfig<Category, GetAllCategoryDto>()
                .Map(dest => dest.Name, src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image))
                .Ignore(nameof(Category.Posts))
                .Ignore(nameof(Category.ParentCategory))
                .IgnoreNullValues(true);

            config.NewConfig<Category, CreateCategoryDto>()
                .Map(dest => dest.Name, src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
         .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image));

            config.NewConfig<Category, UpdateCategoryDto>()
                .Map(dest => dest.Name, src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
         .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image));

            config.NewConfig<CreateCategoryCommand, Category>()
                .Map(dest => dest.Name, src => helper.MapToTranslation(src.Name))
                .Map(dest => dest.Description, src => helper.MapToTranslation(src.Description))
                .Map(dest => dest.ParentCategoryId, src => src.ParentCategoryId)
                .Ignore(dest => dest.Image, src => src.Image);
            config.NewConfig<UpdateCategoryCommand, Category>()
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
