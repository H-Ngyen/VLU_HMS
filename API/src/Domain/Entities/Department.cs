namespace Domain.Entities;

public class Department
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int? HeadUserId { get; set; }
    public User? HeadUser { get; set; }
    public ICollection<User> Users { get; set; } = [];
    public DateTime CreatedAt { get; set; }
}