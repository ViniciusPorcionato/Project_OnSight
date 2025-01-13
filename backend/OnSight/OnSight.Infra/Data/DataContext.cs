using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OnSight.Domain.Entities;

namespace OnSight.Infra.Data
{
    public class DataContext : DbContext
    {
        private readonly string _connectionString;

        public DbSet<Address>? Addresses { get; set; }
        public DbSet<Client>? Clients { get; set; }
        public DbSet<User>? Users { get; set; }
        public DbSet<ServiceCall>? ServiceCalls { get; set; }
        public DbSet<IndividualPerson>? IndividualPersons { get; set; }
        public DbSet<MetricCategory>? MetricCategories { get; set; }
        public DbSet<MetricHistory>? MetricHistories { get; set; }
        public DbSet<Technician>? Technicians { get; set; }
        public DbSet<UnavailabilityRecord>? UnavailabilityRecords { get; set; }

        public DataContext()
        {
            IConfigurationRoot config = new ConfigurationBuilder()
                .AddUserSecrets<DataContext>()
                .Build();

            _connectionString = config["ConnectionStrings:AzurePostgresDB"]!;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cria o índice para busca por texto -> Client.TradeName
            modelBuilder.Entity<Client>()
                .HasIndex(s => s.TradeName)
                .HasMethod("gin")
                .HasOperators("gin_trgm_ops");

            // Cria o índice para busca por texto -> IndividualPerson.Name
            modelBuilder.Entity<IndividualPerson>()
                .HasIndex(s => s.Name)
                .HasMethod("gin")
                .HasOperators("gin_trgm_ops");
        }
    }
}