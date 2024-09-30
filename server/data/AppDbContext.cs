// Data/AppDbContext.cs
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
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderEntry> OrderEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Paper>().ToTable("paper");
            modelBuilder.Entity<Property>().ToTable("properties");
            modelBuilder.Entity<PaperProperty>().ToTable("paper_properties");
            modelBuilder.Entity<Customer>().ToTable("customers");
            modelBuilder.Entity<Order>().ToTable("orders");
            modelBuilder.Entity<OrderEntry>().ToTable("order_entries");

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

            modelBuilder.Entity<OrderEntry>()
                .HasOne(oe => oe.Order)
                .WithMany(o => o.OrderEntries)
                .HasForeignKey(oe => oe.OrderId);

            modelBuilder.Entity<OrderEntry>()
                .HasOne(oe => oe.Product)
                .WithMany()
                .HasForeignKey(oe => oe.ProductId);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany(c => c.Orders)
                .HasForeignKey(o => o.CustomerId);
        }
    }
}
