using CleanArchFramework.Domain.Entities;

namespace CleanArchFramework.Domain.Aggregates
{
    public sealed class UserAggregate : ApplicationUser
    {
        public int PodcastNo {get; set; }
    }
}
