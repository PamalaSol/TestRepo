using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Domain.Entities;
using Mapster;
using CleanArchFramework.Application.Features.Product.Query.GetAllProduct;
using CleanArchFramework.Application.Features.Product.Query.GetProduct;
using CleanArchFramework.Application.Features.Product.Commands.CreateProduct;
using CleanArchFramework.Application.Features.Product.Commands.UpdateProduct;
using CleanArchFramework.Application.Features.Product.Query.GetProductsByCategory;

namespace CleanArchFramework.Application.Profiles
{
    internal class ProductMapping : IRegister
    {
        void IRegister.Register(TypeAdapterConfig config)
        {
            //Product
            var helper = new SharedMappingHelper();
            config.NewConfig<Product, GetProductDto>()
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.SuitableFor, src => helper.MapFromTranslation(src.SuitableFor))
                .Map(dest => dest.Material, src => helper.MapFromTranslation(src.Material))
                .Map(dest => dest.Content, src => helper.MapFromTranslation(src.Content))
                .Map(dest => dest.Heading, src => helper.MapFromTranslation(src.Heading))
                .Map(dest => dest.Housing, src => helper.MapFromTranslation(src.Housing))
                .Map(dest => dest.ConnectionType, src => helper.MapFromTranslation(src.ConnectionType))
                .Map(dest => dest.ConnectionMaterial, src => helper.MapFromTranslation(src.ConnectionMaterial))
                .Map(dest => dest.Industries, src => helper.MapFromTranslation(src.Industries))
                .Map(dest => dest.Screws, src => helper.MapFromTranslation(src.Screws))
                .Map(dest => dest.PinchValvesSleeves, src => helper.SleevePinchValve(src.PinchValves))
                .Map(dest => dest.SleevesPinchValves, src => helper.PinchValveSleeve(src.Sleeves))
                .MaxDepth(3)
                .AddDestinationTransform(DestinationTransform.EmptyCollectionIfNull)
                .Map(dest => dest.DataFiles, src => src.Files.Files
                        .FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()) != null ? helper.MapToFile(src.Files) : null
                )
                .Map(dest => dest.DataImages, src => src.Images.Files
                        .FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()) != null ? helper.MapToFile(src.Images) : null
                );

            config.NewConfig<Product, GetProductsByCategoryDto>()
                //  .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.SuitableFor, src => helper.MapFromTranslation(src.SuitableFor))
                .Map(dest => dest.Material, src => helper.MapFromTranslation(src.Material))
                //   .Map(dest => dest.Content, src => helper.MapFromTranslation(src.Content))
                .Map(dest => dest.Heading, src => helper.MapFromTranslation(src.Heading))
              .Map(dest => dest.ConnectionType, src => helper.MapFromTranslation(src.ConnectionType))
                .Map(dest => dest.Housing, src => helper.MapFromTranslation(src.Housing))
                .Map(dest => dest.ConnectionMaterial, src => helper.MapFromTranslation(src.ConnectionMaterial))
                .Map(dest => dest.Industries, src => helper.MapFromTranslation(src.Industries))
                .Map(dest => dest.Screws, src => helper.MapFromTranslation(src.Screws))
                //.Map(dest => dest.PinchValvesSleeves, src => helper.PinchValveSleeve(src.PinchValves))
                //.Map(dest => dest.SleevesPinchValves, src => helper.SleevePinchValve(src.Sleeves))
                .AddDestinationTransform(DestinationTransform.EmptyCollectionIfNull)
                .Map(dest => dest.DataFiles, src => src.Files.Files
                        .FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()) != null ? helper.MapToFile(src.Files) : null
                )
                .Map(dest => dest.DataImages, src => src.Images.Files
                        .FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()) != null ? helper.MapToFile(src.Images) : null
                );
            config.NewConfig<Product, GetAllProductDto>()
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.SuitableFor, src => helper.MapFromTranslation(src.SuitableFor))
                .Map(dest => dest.Material, src => helper.MapFromTranslation(src.Material))
                .Map(dest => dest.Content, src => helper.MapFromTranslation(src.Content))
                .Map(dest => dest.Heading, src => helper.MapFromTranslation(src.Heading))
                .Map(dest => dest.ConnectionType, src => helper.MapFromTranslation(src.ConnectionType))
                .Map(dest => dest.Housing, src => helper.MapFromTranslation(src.Housing))
                .Map(dest => dest.ConnectionMaterial, src => helper.MapFromTranslation(src.ConnectionMaterial))
                .Map(dest => dest.Industries, src => helper.MapFromTranslation(src.Industries))
                .Map(dest => dest.Screws, src => helper.MapFromTranslation(src.Screws))
                //.Map(dest => dest.PinchValvesSleeves, src => helper.PinchValveSleeve(src.PinchValves))
                //.Map(dest => dest.SleevesPinchValves, src => helper.SleevePinchValve(src.Sleeves))
                .Map(dest => dest.DataFiles, src => src.Files.Files
                        .FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()) != null ? helper.MapToFile(src.Files) : null
                )
                .Map(dest => dest.DataImages, src => src.Images.Files
                        .FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()) != null ? helper.MapToFile(src.Images) : null
                );

            config.NewConfig<Product, CreateProductDto>()
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.SuitableFor, src => helper.MapFromTranslation(src.SuitableFor))
                .Map(dest => dest.Material, src => helper.MapFromTranslation(src.Material))
                .Map(dest => dest.Content, src => helper.MapFromTranslation(src.Content))
                .Map(dest => dest.ConnectionType, src => helper.MapFromTranslation(src.ConnectionType))
                .Map(dest => dest.Heading, src => helper.MapFromTranslation(src.Heading))
                .Map(dest => dest.Housing, src => helper.MapFromTranslation(src.Housing))
                .Map(dest => dest.ConnectionMaterial, src => helper.MapFromTranslation(src.ConnectionMaterial))
                .Map(dest => dest.Industries, src => helper.MapFromTranslation(src.Industries))
                .Map(dest => dest.Screws, src => helper.MapFromTranslation(src.Screws))

                .Map(dest => dest.DataFiles, src => src.Files.Files
                        .FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()) != null
                        ? helper.MapToFile(src.Files) : null)
                .Map(dest => dest.DataImages, src => src.Images.Files
                        .FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()) != null ? helper.MapToFile(src.Images) : null);
            config.NewConfig<Product, UpdateProductDto>()
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.SuitableFor, src => helper.MapFromTranslation(src.SuitableFor))
                .Map(dest => dest.Material, src => helper.MapFromTranslation(src.Material))
                .Map(dest => dest.Content, src => helper.MapFromTranslation(src.Content))
                .Map(dest => dest.Heading, src => helper.MapFromTranslation(src.Heading))
                .Map(dest => dest.Housing, src => helper.MapFromTranslation(src.Housing))
                .Map(dest => dest.ConnectionType, src => helper.MapFromTranslation(src.ConnectionType))
                .Map(dest => dest.ConnectionMaterial, src => helper.MapFromTranslation(src.ConnectionMaterial))
                .Map(dest => dest.Industries, src => helper.MapFromTranslation(src.Industries))
                .Map(dest => dest.Screws, src => helper.MapFromTranslation(src.Screws))
                .Map(dest => dest.DataFiles, src => src.Files.Files
                    .FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()) != null ? helper.MapToFile(src.Files) : null)
                .Map(dest => dest.DataImages, src => src.Images.Files.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()) != null ? helper.MapToFile(src.Images) : null);

            config.NewConfig<CreateProductCommand, Product>()
                .Map(dest => dest.Description, src => helper.MapToTranslation(src.Description))
                .Map(dest => dest.Content, src => helper.MapToTranslation(src.Content))
                .Map(dest => dest.Heading, src => helper.MapToTranslation(src.Heading))
                .Map(dest => dest.SuitableFor, src => helper.MapToTranslation(src.SuitableFor))
                .Map(dest => dest.Material, src => helper.MapToTranslation(src.Material))
                .Map(dest => dest.Housing, src => helper.MapToTranslation(src.Housing))
                .Map(dest => dest.ConnectionType, src => helper.MapToTranslation(src.ConnectionType))
                .Map(dest => dest.ConnectionMaterial, src => helper.MapToTranslation(src.ConnectionMaterial))
                .Map(dest => dest.Industries, src => helper.MapToTranslation(src.Industries))
                .Map(dest => dest.Screws, src => helper.MapToTranslation(src.Screws))
                .Map(dest => dest.PinchValves, src => helper.PinchValveSleeve(src.PinchValvesSleeves))
                .Map(dest => dest.Sleeves, src => helper.PinchValveSleeve(src.PinchValvesSleeves))
                .Ignore(dest => dest.Files, src => src.Files)
                .Ignore(dest => dest.Images, src => src.Images);

            config.NewConfig<UpdateProductCommand, Product>()
                .Ignore(dest => dest.Description, src => src.Description)
                .Ignore(dest => dest.Content, src => src.Content)
                .Ignore(dest => dest.Heading, src => src.Heading)
                .Ignore(dest => dest.SuitableFor, src => src.SuitableFor)
                .Ignore(dest => dest.Material, src => src.Material)
                .Ignore(dest => dest.ProductCategories, src => src.ProductCategories)
                .Ignore(dest => dest.Housing, src => src.Housing)
                .Ignore(dest => dest.PinchValves, src => src.PinchValves)
                .Ignore(dest => dest.Sleeves, src => src.Sleeves)
                .Ignore(dest => dest.ConnectionMaterial, src => src.ConnectionMaterial)
                .Ignore(dest => dest.Industries, src => src.Industries)
                .Ignore(dest => dest.Screws, src => src.Screws)
                .Ignore(dest => dest.ConnectionType, src => src.ConnectionType)

                .AfterMapping((src, dest) => // This is the AfterMap part
                {
                    // Perform actions after the mapping is done

                    dest.Description.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.Description ?? "";
                    dest.Content.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.Content ?? "";
                    dest.Heading.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.Heading ?? "";
                    dest.SuitableFor.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.SuitableFor ?? "";
                    dest.Housing.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.Housing ?? "";
                    dest.Material.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.Material ?? "";
                    dest.ConnectionMaterial.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.ConnectionMaterial ?? "";
                    dest.Industries.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.Industries ?? "";
                    dest.Screws.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.Screws ?? "";
                    dest.ConnectionType.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value = src.ConnectionType ?? "";
                });
        }

    }

}
