using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Paper> Papers { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<PaperProperty> PaperProperties { get; set; }
        public DbSet<Customer> Customers { get; set; }  // Add this
        public DbSet<Order> Orders { get; set; }  // Add this
        public DbSet<OrderEntry> OrderEntries { get; set; }  // Add this

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PaperProperty>()
                .HasKey(pp => new { pp.PaperId, pp.PropertyId });

            modelBuilder.Entity<PaperProperty>()
                .HasOne(pp => pp.Paper)
                .WithMany(p => p.PaperProperties)
                .HasForeignKey(pp => pp.PaperId);

            modelBuilder.Entity<PaperProperty>()
                .HasOne(pp => pp.Property)
                .WithMany(p => p.PaperProperties)
                .HasForeignKey(pp => pp.PropertyId);
        }
    }
}