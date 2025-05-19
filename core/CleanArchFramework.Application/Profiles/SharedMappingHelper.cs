using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Application.Features.Product.Commands.CreateProduct;
using CleanArchFramework.Application.Features.Product.Query.GetAllProduct;
using CleanArchFramework.Application.Features.Product.Query.GetProduct;
using CleanArchFramework.Domain.Entities;
using Mapster;

namespace CleanArchFramework.Application.Profiles
{
    public class SharedMappingHelper
    {
        public LocalizationSet MapToTranslation(string? value)
        {
            var currentLanguage = MapContext.Current.GetService<ILocalizationService>().GetCurrentLanguageId();
            var availableLanguages = MapContext.Current.GetService<ILocalizationService>().GetAvailableLanguages();
            var localizations = new List<Localization>();
            foreach (var lang in availableLanguages)
            {
                string? tempValue = value;
                if (currentLanguage != lang.Value)
                {
                    tempValue = "";
                }
                localizations.Add(new Localization
                {
                    LanguageId = lang.Value,
                    Value = tempValue ?? ""
                });
            }
            return new LocalizationSet
            {
                Localizations = localizations
            };
        }

        public string? MapFromTranslation(LocalizationSet? localizationSet)
        {
            if (localizationSet == null)
            {
                return "";
            }
            return localizationSet.Localizations.FirstOrDefault(x => x.LanguageId == GetLocalizaion())?.Value;

        }
        public int GetLocalizaion()
        {
            return MapContext.Current.GetService<ILocalizationService>().GetCurrentLanguageId();
        }

        public ICollection<ProductFileDto> MapToFile(FileSet value)
        {
            ICollection<ProductFileDto> productFiles = new List<ProductFileDto>();
            foreach (var file in value.Files.Where(x => x.LanguageId == GetLocalizaion()))
            {
                productFiles.Add(new ProductFileDto { FileName = file.FileName, Id = file.Id, Alt = file.Alt,FileCategoryId =file.FileCategoryId,Title = file.Title});
            }
            return productFiles;
        }

        public string GetFileAlt(FileSet? fileSet)
        {
            if (fileSet != null && fileSet.Files.FirstOrDefault(x => x.LanguageId == GetLocalizaion()) != null)
            {
                return fileSet.Files.FirstOrDefault(x => x.LanguageId == GetLocalizaion())?.Alt;
            }
            else return null;
        }
        public Guid? GetFileId(FileSet? fileSet)
        {
            if (fileSet != null && fileSet.Files.FirstOrDefault(x => x.LanguageId == GetLocalizaion()) != null)
            {
                return fileSet.Files.FirstOrDefault(x => x.LanguageId == GetLocalizaion())?.Id;
            }
            else return null;
        }

        public List<GetPinchValveSleeveDto>? PinchValveSleeve(ICollection<PinchValveSleeve> pinchValveSleeve)
        {
            List<GetPinchValveSleeveDto> pslvList = new List<GetPinchValveSleeveDto>();
            if (pinchValveSleeve != null)
                foreach (var pslv in pinchValveSleeve)
                { //If this is pinch valve map all sleeves
                    pslvList.Add(new GetPinchValveSleeveDto
                    {
                        Version = pslv?.Version,
                        Id = pslv.PinchValveId,
                        PinchValvesSleeves = new GetProductDto
                        {
                            Heading = MapFromTranslation(pslv.PinchValve.Heading),
                            Housing = MapFromTranslation(pslv.PinchValve.Housing),
                            Content = MapFromTranslation(pslv.PinchValve.Content),
                            Description = MapFromTranslation(pslv.PinchValve.Description),
                            SuitableFor = MapFromTranslation(pslv.PinchValve.SuitableFor),
                            Size = pslv.PinchValve.Size,
                            Dimensions = pslv.PinchValve.Dimensions,
                            Quality = pslv.PinchValve.Quality,
                            Material = MapFromTranslation(pslv.PinchValve.Material),
                            ConnectionType = MapFromTranslation(pslv.PinchValve.ConnectionType),
                            NominalWidth = pslv.PinchValve.NominalWidth,
                            Series = pslv.PinchValve.Series,
                            Id = pslv.PinchValve.Id,
                        }

                    });
                }
            return pslvList;

        }

        public List<GetPinchValveSleeveDto>? SleevePinchValve(ICollection<PinchValveSleeve> pinchValveSleeve)
        {
            List<GetPinchValveSleeveDto> pslvList = new List<GetPinchValveSleeveDto>();
            if (pinchValveSleeve != null)
                foreach (var pslv in pinchValveSleeve)
                { //If this is pinch valve map all sleeves
                    pslvList.Add(new GetPinchValveSleeveDto
                    {
                        Version = pslv?.Version,
                        Id = pslv.SleeveId,
                        PinchValvesSleeves =  new GetProductDto
                        {
                            Heading = MapFromTranslation(pslv.Sleeve.Heading),
                            Housing = MapFromTranslation(pslv.Sleeve.Housing),
                            Content = MapFromTranslation(pslv.Sleeve.Content),
                            Description = MapFromTranslation(pslv.Sleeve.Description),
                            SuitableFor = MapFromTranslation(pslv.Sleeve.SuitableFor),
                            Size = pslv.Sleeve.Size,
                            Dimensions = pslv.Sleeve.Dimensions,
                            Quality = pslv.Sleeve.Quality,
                            Material = MapFromTranslation(pslv.Sleeve.Material),
                            ConnectionType = MapFromTranslation(pslv.Sleeve.ConnectionType),
                            NominalWidth = pslv.Sleeve.NominalWidth,
                            Series = pslv.Sleeve.Series,
                            Id = pslv.Sleeve.Id,
                        }
                    });
                }
            return pslvList;
        }

        public ICollection<PinchValveSleeve> PinchValveSleeve(List<PinchValvesSleevesDto>? pinchValvesSleeves)
        {
            ICollection<PinchValveSleeve> pslvList = new List<PinchValveSleeve>();

            if (pinchValvesSleeves != null)
            {
                foreach (var pslv in pinchValvesSleeves)
                {
                    pslvList.Add(new PinchValveSleeve { Version = pslv?.Version, SleeveId = pslv.Id });
                }
                return pslvList;
            }
            return null;
        }


    }
}
