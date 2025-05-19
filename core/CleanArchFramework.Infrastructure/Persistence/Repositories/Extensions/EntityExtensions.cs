using CleanArchFramework.Domain.Entities;
using System.ComponentModel;
using System.Reflection;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CleanArchFramework.Infrastructure.Persistence.Repositories.Extensions
{
    public static class EntityExtensions
    {
        public static T FilterByLanguage<T>(T entity, int language)
        {
            var entityType = typeof(T);

            foreach (var property in entityType.GetProperties())
            {
                if (property.PropertyType == typeof(LocalizationSet))
                {
                    var originalValue = (LocalizationSet)property.GetValue(entity);
                    var filteredValue = FilterLocalizationSet(originalValue, language);
                    property.SetValue(entity, filteredValue);
                }
                else if (property.PropertyType == typeof(FileSet))
                {
                    var originalValue = (FileSet)property.GetValue(entity);
                    var filteredValue = FilterFileSet(originalValue, language);
                    property.SetValue(entity, filteredValue);
                }
            }

            return entity;
        }

        private static LocalizationSet FilterLocalizationSet(LocalizationSet set, int language)
        {
            return set != null
                ? new LocalizationSet
                {
                    Id = set.Id,
                    Localizations = set.Localizations.Where(loc => loc.LanguageId == language).ToList()
                }
                : null;
        }

        private static FileSet FilterFileSet(FileSet fileSet, int language)
        {
            return fileSet != null
                ? new FileSet
                {
                    Id = fileSet.Id,
                    Files = fileSet.Files.Where(file => file.LanguageId == language).ToList()
                }
                : null;
        }

        public static T InitializeObject<T>(T source, int language)
            where T : new()
        {
            var result = new T();
            var type = typeof(T);
            var allProperties = type.GetProperties();
            foreach (var prop in allProperties)
            {
                var value = prop.GetValue(source);

                if (prop.PropertyType == typeof(FileSet))
                {
                    var fileSetValue = value as FileSet;

                    if (fileSetValue != null)
                    {
                        var files = new FileSet
                        {
                            Files = fileSetValue.Files.Where(file => file.LanguageId == language)
                                .ToList(),
                            //     Id = (Guid) fileSetValue?.Files?.FirstOrDefault()?.FileSetId
                        };
                        prop.SetValue(result, files);
                    }
                }
                else if (prop.PropertyType == typeof(LocalizationSet))
                {
                    var localizationSetValue = value as LocalizationSet;
                    if (localizationSetValue == null)
                    {
                        continue;
                    }
                    var localization = new LocalizationSet
                    {
                        Localizations = localizationSetValue.Localizations.Where(file => file.LanguageId == language).ToList()
                        ,
                        Id = (Guid)(localizationSetValue?.Localizations?.FirstOrDefault()?.LocalizationSetId)
                    };
                    prop.SetValue(result, localization);
                }
                else
                {
                    // For all other property types, simply copy the value
                    prop.SetValue(result, value);
                }
            }

            return result;
        }


        /// <summary>
        /// Used for automaticly generating navigation properties (include) that contains Localization attribute.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static Func<IQueryable<T>, IQueryable<T>> GetNavigations<T>() where T : class
        {
            var type = typeof(T);
            var navigationProperties = new List<string>();

            //get navigation properties
            GetNavigationProperties(type, type, string.Empty, navigationProperties);

            Func<IQueryable<T>, IQueryable<T>> includes = (query =>
            {
                return navigationProperties.Aggregate(query, (current, inc) => current.Include(inc));
            });

            return includes;
        }

        private static void GetNavigationProperties(Type baseType, Type type, string parentPropertyName, IList<string> accumulator)
        {
            //get navigation properties
            var properties = type.GetProperties();
            var navigationPropertyInfoList = properties.Where(prop => prop.IsDefined(typeof(LocalizableAttribute)));

            foreach (PropertyInfo prop in navigationPropertyInfoList)
            {
                var propertyType = prop.PropertyType;
                var elementType = propertyType.GetTypeInfo().IsGenericType ? propertyType.GetGenericArguments()[0] : propertyType;

                //Prepare navigation property in {parentPropertyName}.{propertyName} format and push into accumulator
                var properyName = string.Format("{0}{1}{2}", parentPropertyName, string.IsNullOrEmpty(parentPropertyName) ? string.Empty : ".", prop.Name);
                accumulator.Add(properyName);

                //Skip recursion of propert has JsonIgnore attribute or current property type is the same as baseType
                var isJsonIgnored = prop.IsDefined(typeof(JsonIgnoreAttribute));
                if (!isJsonIgnored && elementType != baseType)
                {
                    GetNavigationProperties(baseType, elementType, properyName, accumulator);
                }
            }
        }

        /// <summary>
        /// Get all properties of a type ex. LocalizationSet
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static List<PropertyInfo> GetInverseProperties<T>()
        {
            return typeof(T)
                .GetProperties()
                .Where(p => p.PropertyType == typeof(LocalizationSet))
                .ToList();
        }
    }
}
