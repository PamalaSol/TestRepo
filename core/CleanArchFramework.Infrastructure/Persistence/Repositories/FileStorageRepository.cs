using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Text.RegularExpressions;

namespace CleanArchFramework.Infrastructure.Persistence.Repositories
{
    internal class FileStorageRepository : BaseRepository<FileStorage, Guid>, IFileStorageRepository
    {
        public FileStorageRepository(PersistenceDbContext context) : base(context)
        {

        }

        public async Task<PagedResult<FileStorage>> GetPagedAndOrderResponseAsync(Expression<Func<FileStorage, bool>> predicate, QueryOptions options, int language = 1)
        {
            var serviceResult = new PagedResult<FileStorage>();

            // Fetch data from the database
            var query = DbSet.Where(predicate).AsQueryable();
            serviceResult.GetPaged(query, options.PageNo, options.PageSize);
            if (!string.IsNullOrEmpty(options.SearchTerm))
            {
                var keywords = options.SearchTerm.ToLower()
                                     .Split(new[] { ' ', '_', '-' }, StringSplitOptions.RemoveEmptyEntries);

                // Fetch all data that matches the predicate first
                var allFiles = await query.AsNoTracking().ToListAsync();

                // Apply the search and sorting logic on the client side
                var filteredFiles = allFiles
                    .Where(x =>
                        keywords.Any(kw =>
                            x.Alt.ToLower().Contains(kw) ||
                            x.FileName.ToLower().Contains(kw) ||
                            x.Title.ToLower().Contains(kw))
                    )
                    .Select(x => new
                    {
                        File = x,
                        MatchScore = keywords.Count(kw =>
                            x.Alt.ToLower().Contains(kw) ||
                            x.FileName.ToLower().Contains(kw) ||
                            x.Title.ToLower().Contains(kw)),
                            SeriesNumber = ExtractSerieNumber(x.FileName)
                    })
                    .Where(x => x.MatchScore > 0)
                    .OrderByDescending(x => x.MatchScore)
                    .ThenBy(e => e.SeriesNumber)
                    .Select(x => x.File)
                    .Skip(options.Skip)
                    .Take(options.PageSize)
                    .ToList();

                serviceResult.Data = filteredFiles;
            }
            else
            {
                // If no search term, just apply paging and return results
                serviceResult.Data = await query
                    .Skip(options.Skip)
                    .Take(options.PageSize)
                    .AsNoTracking()
                    .ToListAsync();
            }
            serviceResult.CurrentRecords = serviceResult.Data.Count;
            return serviceResult;
        }
        private static int ExtractSerieNumber(string fileName)
        {
            var match = Regex.Match(fileName, @"s[ée]ries?[_\s]?(\d+)", RegexOptions.IgnoreCase);
            if (match.Success && int.TryParse(match.Groups[1].Value, out int serieNumber))
            {
                return serieNumber;
            }
            return -1;
        }
    }
}
