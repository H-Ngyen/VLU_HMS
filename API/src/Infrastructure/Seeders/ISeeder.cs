namespace Infrastructure.Seeders;

public interface ISeeder
{
    /// <summary>
    /// Seeds initial master data to the database if tables are empty.
    /// Includes: 
    /// - 56 ethnic groups of Vietnam 
    /// - 3 system roles (Admin, Teacher, Student)
    /// </summary>
    public Task Seed();
}
