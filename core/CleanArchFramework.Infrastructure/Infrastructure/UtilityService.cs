using CleanArchFramework.Application.Contracts.Infrastructure;
using CleanArchFramework.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CleanArchFramework.Infrastructure.Infrastructure
{
    public class UtilityService : IUtilityService
    {
        readonly PersistenceDbContext _context;
        public UtilityService(PersistenceDbContext dbContext)
        {
            _context = dbContext;
        }
        public async Task<bool?> RemoveAllUnusedLocalizationSets()
        {
            // Get all distinct ids from related entities
            var referencedLocalizationSetIds = new List<Guid>();

            // Collect LocalizationSet ids referenced by Products
            var productLocalizationSetIds = _context.Product
                .ToList()
                .SelectMany(p => new Guid?[]
                {
                    p.HeadingId, p.DescriptionId, p.ContentId, p.HousingId, p.ScrewsId, p.IndustriesId, p.MaterialId,
                    p.SuitableForId, p.ConnectionMaterialId,p.ConnectionTypeId
                })
                .Where(id => id.HasValue)
                .Select(id => id.Value);

            referencedLocalizationSetIds.AddRange(_context.About
                .ToList()
                .SelectMany(p => new Guid?[] { p.TitleId, p.InfoTextId, p.SubtitleId })
                .Where(id => id.HasValue)
                .Select(id => id.Value)
                );

            referencedLocalizationSetIds.AddRange(_context.Category
                .ToList()
                .SelectMany(p => new Guid?[] { p.NameId, p.DescriptionId })
                .Where(id => id.HasValue)
                .Select(id => id.Value)
                );
            referencedLocalizationSetIds.AddRange(_context.Faq
                .ToList()
                .SelectMany(p => new Guid?[] { p.AnswerId, p.QuestionId })
                .Where(id => id.HasValue)
                .Select(id => id.Value)
           );

            referencedLocalizationSetIds.AddRange(_context.Post
                .ToList()
                .SelectMany(p => new Guid?[] { p.ContentId, p.DescriptionId, p.NameId })
                .Where(id => id.HasValue)
                .Select(id => id.Value)
                .ToList());

            referencedLocalizationSetIds.AddRange(_context.ProductCategory
                .ToList()
                .SelectMany(p => new Guid?[] { p.NameId, p.DescriptionId })
                .Where(id => id.HasValue)
                .Select(id => id.Value)
                );

            referencedLocalizationSetIds.AddRange(_context.OrderStatus
                .ToList()
                .SelectMany(p => new Guid?[] { p.NameId, p.DescriptionId })
                .Where(id => id.HasValue)
                .Select(id => id.Value)
            );
            referencedLocalizationSetIds.AddRange(productLocalizationSetIds);

            // Add other referenced LocalizationSets from other entities as needed

            // Get LocalizationSets that have no matching entities
            var setsToRemove = await _context.LocalizationSet
                .Where(ls => !referencedLocalizationSetIds.Contains(ls.Id))
                .ToListAsync();

            // Remove the identified LocalizationSets
            _context.LocalizationSet.RemoveRange(setsToRemove);

          await  _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool?> RemoveAllUnusedFileSets()
        {

            var referencedFileSetIds = new List<Guid>();
          
            var productFileSetIds = _context.Product
                .ToList()
                .SelectMany(p => new Guid?[]
                {
                    p.FilesId, p.ImagesId
                })
                .Where(id => id.HasValue)
                .Select(id => id.Value);

            referencedFileSetIds.AddRange(_context.About
                .ToList()
                .SelectMany(p => new Guid?[] { p.ImageId })
                .Where(id => id.HasValue)
                .Select(id => id.Value)
                );

            referencedFileSetIds.AddRange(_context.Category
                .ToList()
                .SelectMany(p => new Guid?[] { p.ImageId })
                .Where(id => id.HasValue)
                .Select(id => id.Value)
                );
          
            referencedFileSetIds.AddRange(_context.ProductCategory
                .ToList()
                .SelectMany(p => new Guid?[] { p.ImageId })
                .Where(id => id.HasValue)
                .Select(id => id.Value)
                );

            referencedFileSetIds.AddRange(productFileSetIds);

            var setsToRemove = await _context.FileSet
                .Where(ls => !referencedFileSetIds.Contains(ls.Id))
                .ToListAsync();

            _context.FileSet.RemoveRange(setsToRemove);

            await _context.SaveChangesAsync();
            return true;
        }

    }
}
