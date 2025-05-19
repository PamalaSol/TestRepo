using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using CleanArchFramework.Infrastructure.Persistence.Repositories.Extensions;



namespace CleanArchFramework.Infrastructure.Persistence.Repositories
{

    public class ProductRepository : BaseRepository<Product, Guid>, IProductRepository
    {
        public ProductRepository(PersistenceDbContext context) : base(context)
        {
        }

        public async Task<Product?> GetFirstProductNoTrackingAsync(Expression<Func<Product, bool>> predicate, int language = 1)
        {
            var query = DbSet
                .AsQueryable();
            query = query
                .Include(x => x.ProductCategories)
                .Include(x => x.ConnectionType.Localizations)
                .Include(x => x.ProductCategories)
                .ThenInclude(x => x.Name)
                .ThenInclude(x => x.Localizations)
                .Include(x => x.Content)
                .ThenInclude(x => x.Localizations)
                .Include(x => x.Description)
                .ThenInclude(x => x.Localizations)
                .Include(x => x.Heading)
                .ThenInclude(x => x.Localizations)
                .Include(x => x.Material)
                .ThenInclude(x => x.Localizations)
                .Include(x => x.SuitableFor)
                .ThenInclude(x => x.Localizations)
                .Include(x => x.Housing)
                .ThenInclude(x => x.Localizations)
                .Include(x => x.ConnectionMaterial)
                .ThenInclude(x => x.Localizations)
                .Include(x => x.Screws)
                .ThenInclude(x => x.Localizations)
                .Include(x => x.Industries)

                .ThenInclude(x => x.Localizations)
                .Include(x => x.Files)
                .ThenInclude(x => x.Files)
                .Include(x => x.Images)
                .ThenInclude(x => x.Files)
                .Include(x => x.Sleeves)
                .ThenInclude(x => x.PinchValve)
                .Include(x => x.PinchValves)
                .ThenInclude(x => x.Sleeve)
                .Where(predicate).AsNoTracking();
            //var includes = GetNavigations<Product>();
            //query = includes(query);
            var entity = await query.AsSplitQuery()
                .Select(product => EntityExtensions.InitializeObject(product, language))
                .FirstOrDefaultAsync();

            //var entity = await query.FirstOrDefaultAsync();
            return entity ?? null;
        }

        public async Task<Product?> GetFirstProductAsync(Expression<Func<Product, bool>> predicate, int language = 1)
        {
            var query = DbSet
                .AsQueryable();
            query = query
                .Include(x => x.ProductCategories)!
                .ThenInclude(x => x.Name.Localizations)
                .Include(x => x.Content.Localizations)
                .Include(x => x.Description.Localizations)
                .Include(x => x.Heading.Localizations)
                .Include(x => x.Material.Localizations)
                .Include(x => x.SuitableFor.Localizations)
                .Include(x => x.Housing.Localizations)
                .Include(x => x.ConnectionMaterial.Localizations)
                .Include(x => x.Screws.Localizations)
                .Include(x => x.Industries.Localizations)
                .Include(x => x.ConnectionType.Localizations)
                .Include(x => x.Files)
                .ThenInclude(x => x.Files)
                .Include(x => x.Images)
                .ThenInclude(x => x.Files)
                .Include(x => x.Sleeves)
                .Include(x => x.PinchValves)
               .Where(predicate);
            //var includes = GetNavigations<Product>();
            //query = includes(query);
            var entity = await query.AsSplitQuery()
                .Select(product => EntityExtensions.InitializeObject(product, language))
                .FirstOrDefaultAsync();

            //var entity = await query.FirstOrDefaultAsync();
            return entity ?? null;
        }

        //public async Task<PagedResult<Product>> GetPagedProductAndOrderResponse1Async(Expression<Func<Product, bool>> predicate,
        //    QueryOptions options, Expression<Func<Product, object>> defaultOrderExpression,
        //    Expression<Func<Product, object>> customDateOrderExpression)
        //{
        //    var serviceResult = new PagedResult<Product>();
        //    var query = DbSet.AsQueryable();
        //    serviceResult.GetPaged(query, options.PageNo, options.PageSize);
        //    query = query.AsNoTracking().Where(predicate);
        //    query = query.Include(x => x.ProductCategories);

        //    query = options.ApplyOrderBy(query, defaultOrderExpression, customDateOrderExpression);
        //    query = query.Skip(options.Skip).Take(options.PageSize);
        //    var includes = GetNavigations<Product>();
        //    query = includes(query);
        //    serviceResult.Data = await query
        //        .Select(product => InitializeObject(product))
        //        .ToListAsync();
        //    return serviceResult;
        //}

        public async Task<PagedResult<Product>> GetPagedProductAndOrderResponseAsync(Expression<Func<Product, bool>> predicate,
            QueryOptions options, Expression<Func<Product, object>> defaultOrderExpression,
            Expression<Func<Product, object>> customDateOrderExpression, int language = 1)
        {
            var serviceResult = new PagedResult<Product>();

            var query = DbSet.AsQueryable();
            serviceResult.GetPaged(query, options.PageNo, options.PageSize);
            query = query.AsNoTracking().Where(predicate);
            query = query
                .Include(x => x.ProductCategories)!
                .ThenInclude(x => x.Name.Localizations)
                .Include(x => x.Content.Localizations)
                .Include(x => x.Description.Localizations)
                .Include(x => x.Heading.Localizations)
                .Include(x => x.Material.Localizations)
                .Include(x => x.SuitableFor.Localizations)
                .Include(x => x.ConnectionType.Localizations)
                .Include(x => x.Housing.Localizations)
                .Include(x => x.ConnectionMaterial.Localizations)
                .Include(x => x.Screws.Localizations)
                .Include(x => x.Industries.Localizations)
                .Include(x => x.Files)
                .ThenInclude(x => x.Files)
                .Include(x => x.Images)
                .ThenInclude(x => x.Files)
                .Include(x => x.Sleeves)
                .Include(x => x.PinchValves);
            query = options.ApplyOrderBy(query, defaultOrderExpression, customDateOrderExpression);
            query = query.Skip(options.Skip).Take(options.PageSize);

            serviceResult.Data = await query.AsSplitQuery() //SPLIT QUERY TO IMPROVE PERFORMANCE
                .Select(product => EntityExtensions.InitializeObject(product, language))
                .ToListAsync();

            //TEST AREA
            //   var includes = GetNavigations<Product>();
            //    query = includes(query);
            //serviceResult.Data = await query.AsSingleQuery()
            //    .Select(product => EntityExtensions.InitializeObject(product, language))
            //    .ToListAsync();

            //   serviceResult.Data = await GetProductWithSelect(query,language).AsSplitQuery().ToListAsync();
            //     .Adapt<GetProductsByCategoryDto>();

            serviceResult.CurrentRecords = serviceResult.Data.Count;
            return serviceResult;
        }



        #region GetSelectProduct

        //private string GetLocalizedValue(LocalizationSet localizationSet, int languageId)
        //{
        //    if (localizationSet == null)
        //        return null;

        //    return localizationSet.Localizations
        //        .FirstOrDefault(l => l.LanguageId == languageId)?.Value;
        //}

        //private IQueryable<Product> GetProductWithSelect(IQueryable<Product> product, int languageId)
        //{
        //    product.Select(product => new GetProductDto()
        //    {
        //        Id = product.Id,
        //        Heading = GetLocalizedValue(product.Heading, languageId),
        //        Description = GetLocalizedValue(product.Description, languageId),
        //        Content = GetLocalizedValue(product.Content, languageId),
        //        Series = product.Series,
        //        Quality = product.Quality,
        //        Dimensions = product.Dimensions,
        //        ConnectionType = product.ConnectionType,
        //        Housing = GetLocalizedValue(product.Housing, languageId),
        //        NominalWidth = product.NominalWidth,
        //        Size = product.Size,
        //        Material = GetLocalizedValue(product.Material, languageId),
        //        SuitableFor = GetLocalizedValue(product.SuitableFor, languageId),
        //        ConnectionMaterial = GetLocalizedValue(product.ConnectionMaterial, languageId),
        //        Screws = GetLocalizedValue(product.Screws, languageId),
        //        Industries = GetLocalizedValue(product.Industries, languageId),
        //        PinchValvesSleeves = product.Sleeves.Select(s => new GetPinchValveSleeveDto()
        //        {
        //            Id = product.Id,
        //            PinchValvesSleeves = new GetProductDto
        //            {
        //                Id = s.Sleeve.Id,
        //                Heading = GetLocalizedValue(s.Sleeve.Heading, languageId),
        //                Description = GetLocalizedValue(s.Sleeve.Description, languageId),
        //                Content = GetLocalizedValue(s.Sleeve.Content, languageId),
        //                Series = s.Sleeve.Series,
        //                Quality = s.Sleeve.Quality,
        //                Dimensions = s.Sleeve.Dimensions,
        //                ConnectionType = s.Sleeve.ConnectionType,
        //                Housing = GetLocalizedValue(s.Sleeve.Housing, languageId),
        //                NominalWidth = s.Sleeve.NominalWidth,
        //                Size = s.Sleeve.Size,
        //                Material = GetLocalizedValue(s.Sleeve.Material, languageId),
        //                SuitableFor = GetLocalizedValue(s.Sleeve.SuitableFor, languageId),
        //                ConnectionMaterial = GetLocalizedValue(s.Sleeve.ConnectionMaterial, languageId),
        //                Screws = GetLocalizedValue(s.Sleeve.Screws, languageId),
        //                Industries = GetLocalizedValue(s.Sleeve.Industries, languageId),
        //            },
        //            Version = s.Version
        //            // Map properties of SleeveDTO here
        //        }).ToList(),
        //        SleevesPinchValves = product.PinchValves.Select(s => new GetPinchValveSleeveDto()
        //        {
        //            Id = product.Id,
        //            PinchValvesSleeves = new GetProductDto
        //            {
        //                Id = s.PinchValve.Id,
        //                Heading = GetLocalizedValue(s.PinchValve.Heading, languageId),
        //                Description = GetLocalizedValue(s.PinchValve.Description, languageId),
        //                Content = GetLocalizedValue(s.PinchValve.Content, languageId),
        //                Series = s.PinchValve.Series,
        //                Quality = s.PinchValve.Quality,
        //                Dimensions = s.PinchValve.Dimensions,
        //                ConnectionType = s.PinchValve.ConnectionType,
        //                Housing = GetLocalizedValue(s.PinchValve.Housing, languageId),
        //                NominalWidth = s.PinchValve.NominalWidth,
        //                Size = s.PinchValve.Size,
        //                Material = GetLocalizedValue(s.PinchValve.Material, languageId),
        //                SuitableFor = GetLocalizedValue(s.PinchValve.SuitableFor, languageId),
        //                ConnectionMaterial = GetLocalizedValue(s.PinchValve.ConnectionMaterial, languageId),
        //                Screws = GetLocalizedValue(s.PinchValve.Screws, languageId),
        //                Industries = GetLocalizedValue(s.PinchValve.Industries, languageId),
        //            },
        //            Version = s.Version
        //            // Map properties of SleeveDTO here
        //        }).ToList(),
        //        ProductCategories = product.ProductCategories.Select(pc => new GetSimpleProductCategoryDto()
        //        {
        //            Name = GetLocalizedValue(pc.Name, languageId),
        //            Alt = pc.Image.Files.FirstOrDefault().Alt,
        //            Description = GetLocalizedValue(pc.Description, languageId),
        //            Id = pc.Id
        //        }
        //       ).ToList()

        //    });

        //    return product;
        //}



        #endregion

    }
}
