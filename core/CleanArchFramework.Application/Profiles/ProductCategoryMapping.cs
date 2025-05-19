using Mapster;
using CleanArchFramework.Application.Features.ProductCategory.Command.CreateProductCategory;
using CleanArchFramework.Application.Features.ProductCategory.Command.UpdateProductCategory;
using CleanArchFramework.Application.Features.ProductCategory.Query.GetAllProductCategory;
using CleanArchFramework.Application.Features.ProductCategory.Query.GetProductCategory;
using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Application.Profiles
{
    internal class ProductCategoryMapping : IRegister
    {
        void IRegister.Register(TypeAdapterConfig config)
        {
            var helper = new SharedMappingHelper();
            config.NewConfig<ProductCategory, GetProductCategoryDto>()
                .Map(dest => dest.Name,
                    src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Description,
                    src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image));

            config.NewConfig<ProductCategory, GetAllProductCategoryDto>()
                .Map(dest => dest.Name,
                    src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Description,
                    src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image))
                .IgnoreNullValues(true);

            config.NewConfig<ProductCategory, CreateProductCategoryDto>()
                .Map(dest => dest.Name,
                    src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Description,
                    src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image));

            config.NewConfig<ProductCategory, UpdateProductCategoryDto>()
                .Map(dest => dest.Name,
                    src => helper.MapFromTranslation(src.Name))
                .Map(dest => dest.Description,
                    src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.Alt, src => helper.GetFileAlt(src.Image))
                .Map(dest => dest.ImageId, src => helper.GetFileId(src.Image));
            config.NewConfig<CreateProductCategoryCommand, ProductCategory>()
                .Map(dest => dest.Name, src => helper.MapToTranslation(src.Name))
                .Map(dest => dest.Description, src => helper.MapToTranslation(src.Description));
            //     .Map(dest => dest.ParentProductCategoryId, src => src.ParentProductCategoryId);
            config.NewConfig<UpdateProductCategoryCommand, ProductCategory>()
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
