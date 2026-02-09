using Domain.Interfaces;

namespace Infrastructure.Services;

public class DateTimeProvider : IDateTimeProvider
{
    public DateTime Now => TimeZoneInfo.ConvertTime(DateTime.Now, 
        TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
}