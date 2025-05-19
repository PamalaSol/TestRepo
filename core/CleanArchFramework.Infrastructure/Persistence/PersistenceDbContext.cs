using CleanArchFramework.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CleanArchFramework.Domain.Configuration;

namespace CleanArchFramework.Infrastructure.Persistence
{
    public class PersistenceDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string,
        IdentityUserClaim<string>,
        ApplicationUserRole,
        IdentityUserLogin<string>,
        IdentityRoleClaim<string>, IdentityUserToken<string>>
    {

        public PersistenceDbContext()
        {

        }
        public PersistenceDbContext(DbContextOptions<PersistenceDbContext> options
            )
            : base(options)
        {

        }
        public DbSet<Product> Product { get; set; }
        public DbSet<FileSet> FileSet { get; set; }
        public DbSet<FileStorage> FileStorage { get; set; }
        public DbSet<ProductCategory> ProductCategory { get; set; }
        public DbSet<Language> Language { get; set; }
        public DbSet<LocalizationSet> LocalizationSet { get; set; }
        public DbSet<Localization> Localization { get; set; }
        public DbSet<Menu> Menu { get; set; }
        public DbSet<Tag> Tag { get; set; }
        public DbSet<Faq> Faq { get; set; }
        public DbSet<About> About { get; set; }
        public DbSet<SiteSettings> SiteSettings { get; set; }
        public DbSet<Post> Post { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderItem> OrderItem { get; set; }
        public DbSet<OrderStatus> OrderStatus { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfiguration(new ApplicationUserConfiguration());
            builder.ApplyConfiguration(new ApplicationRoleConfiguration());
            builder.ApplyConfiguration(new ApplicationUserRoleConfiguration());

            // Configure the primary key for the PersonLinks
            builder.Entity<PinchValveSleeve>()
                .HasKey(t => new { t.PinchValveId, t.SleeveId,t.Version });

            builder.Entity<PinchValveSleeve>()
                .HasOne<Product>(x => x.PinchValve)
                .WithMany(t => t.PinchValves)
                .HasForeignKey(d => d.PinchValveId);

            builder.Entity<PinchValveSleeve>()
                .HasOne(x => x.Sleeve)
                .WithMany(t => t.Sleeves)
                .HasForeignKey(d => d.SleeveId);
        }

    }
}

