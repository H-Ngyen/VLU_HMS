using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

internal class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    internal DbSet<Role> Roles { get; set; }
    internal DbSet<User> Users { get; set; }
    internal DbSet<Ethnicity> Ethnicities { get; set; }
    internal DbSet<Patient> Patients { get; set; }
    internal DbSet<MedicalRecord> MedicalRecords { get; set; }
    internal DbSet<MedicalAttachment> MedicalAttachments { get; set; }
    internal DbSet<DepartmentTransfer> DepartmentTransfers { get; set; }
    internal DbSet<MedicalRecordDetail> MedicalRecordDetails { get; set; }
    internal DbSet<MedicalRecordRiskFactor> MedicalRecordRiskFactors { get; set; }

    internal DbSet<XRay> XRays { get; set; }
    internal DbSet<Hematology> Hematologies { get; set; }

    internal DbSet<XRayStatusLog> XRayStatusLogs { get; set; }
    internal DbSet<HematologyStatusLog> HematologyStatusLogs { get; set; }

    internal DbSet<Department> Departments { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Tự động tìm và apply tất cả configurations
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}