using Domain.Entities;
using Infrastructure.Persistence;

namespace Infrastructure.Seeders;

internal class Seeder(AppDbContext dbContext) : ISeeder
{
    /// <summary>
    /// Seeds initial master data to the database if tables are empty.
    /// Includes: 
    /// - 56 ethnic groups of Vietnam 
    /// - 3 system roles (Admin, Teacher, Student)
    /// </summary>
    public async Task Seed()
    {
        if (await dbContext.Database.CanConnectAsync())
        {
            // Seed Ethnicities (56 ethnic groups in Vietnam)
            if (!dbContext.Ethnicities.Any())
            {
                var ethnicities = GetEthnicities();
                dbContext.Ethnicities.AddRange(ethnicities);
                await dbContext.SaveChangesAsync();
            }

            // Seed Roles (Admin, Teacher, Student)
            if (!dbContext.Roles.Any())
            {
                var roles = GetRoles();
                dbContext.Roles.AddRange(roles);
                await dbContext.SaveChangesAsync();
            }


            if (!dbContext.Users.Any())
            {
                var users = GetUserAdmin();
                dbContext.Users.AddRange(users);
                await dbContext.SaveChangesAsync();
            }
        }
    }
    private IEnumerable<User> GetUserAdmin()
    {
        List<User> users = [
            new() { Id = 1, Auth0Id = "something", Email = "admin@gmail.com", RoleId = 1, CreateAt = DateTime.UtcNow },
        ];
        return users;
    }

    /// <summary>
    /// Returns predefined roles for the system
    /// </summary>
    private IEnumerable<Role> GetRoles()
    {
        List<Role> roles = [
            new() { Id = 1, Name = "Admin" },
            new() { Id = 2, Name = "Teacher" },
            new() { Id = 3, Name = "Student" }
        ];
        return roles;
    }

    /// <summary>
    /// Returns 56 ethnic groups in Vietnam
    /// </summary>
    private IEnumerable<Ethnicity> GetEthnicities()
    {
        List<Ethnicity> ethnicities = [
            new() { Id = 1, Name = "Kinh" },
            new() { Id = 2, Name = "Tày" },
            new() { Id = 3, Name = "Thái" },
            new() { Id = 4, Name = "Hoa" },
            new() { Id = 5, Name = "Khơ-me" },
            new() { Id = 6, Name = "Mường" },
            new() { Id = 7, Name = "Nùng" },
            new() { Id = 8, Name = "HMông" },
            new() { Id = 9, Name = "Dao" },
            new() { Id = 10, Name = "Gia-rai" },
            new() { Id = 11, Name = "Ngái" },
            new() { Id = 12, Name = "Ê-đê" },
            new() { Id = 13, Name = "Ba na" },
            new() { Id = 14, Name = "Xơ-Đăng" },
            new() { Id = 15, Name = "Sán Chay" },
            new() { Id = 16, Name = "Cơ-ho" },
            new() { Id = 17, Name = "Chăm" },
            new() { Id = 18, Name = "Sán Dìu" },
            new() { Id = 19, Name = "Hrê" },
            new() { Id = 20, Name = "Mnông" },
            new() { Id = 21, Name = "Ra-glai" },
            new() { Id = 22, Name = "Xtiêng" },
            new() { Id = 23, Name = "Bru-Vân Kiều" },
            new() { Id = 24, Name = "Thổ" },
            new() { Id = 25, Name = "Giáy" },
            new() { Id = 26, Name = "Cơ-tu" },
            new() { Id = 27, Name = "Gié Triêng" },
            new() { Id = 28, Name = "Mạ" },
            new() { Id = 29, Name = "Khơ-mú" },
            new() { Id = 30, Name = "Co" },
            new() { Id = 31, Name = "Tà-ôi" },
            new() { Id = 32, Name = "Chơ-ro" },
            new() { Id = 33, Name = "Kháng" },
            new() { Id = 34, Name = "Xinh-mun" },
            new() { Id = 35, Name = "Hà Nhì" },
            new() { Id = 36, Name = "Chu ru" },
            new() { Id = 37, Name = "Lào" },
            new() { Id = 38, Name = "La Chí" },
            new() { Id = 39, Name = "La Ha" },
            new() { Id = 40, Name = "Phù Lá" },
            new() { Id = 41, Name = "La Hủ" },
            new() { Id = 42, Name = "Lự" },
            new() { Id = 43, Name = "Lô Lô" },
            new() { Id = 44, Name = "Chứt" },
            new() { Id = 45, Name = "Mảng" },
            new() { Id = 46, Name = "Pà Thẻn" },
            new() { Id = 47, Name = "Co Lao" },
            new() { Id = 48, Name = "Cống" },
            new() { Id = 49, Name = "Bố Y" },
            new() { Id = 50, Name = "Si La" },
            new() { Id = 51, Name = "Pu Péo" },
            new() { Id = 52, Name = "Brâu" },
            new() { Id = 53, Name = "Ơ Đu" },
            new() { Id = 54, Name = "Rơ măm" },
            new() { Id = 55, Name = "Người nước ngoài" },
            new() { Id = 56, Name = "Không rõ" }
        ];
        return ethnicities;
    }
}