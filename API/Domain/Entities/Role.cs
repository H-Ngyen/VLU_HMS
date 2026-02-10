namespace Domain.Entities;

public class Role
{
    public int Id { get; set; }
    public required string Name { get; set; }
    
    // Navigation Properties
    public ICollection<User> Users { get; set; } = [];
}