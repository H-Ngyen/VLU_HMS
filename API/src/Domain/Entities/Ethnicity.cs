namespace Domain.Entities;

public class Ethnicity
{
    public int Id { get; set; } // Database Id không tự tăng trong script SQL (insert tay)
    public required string Name { get; set; }
}