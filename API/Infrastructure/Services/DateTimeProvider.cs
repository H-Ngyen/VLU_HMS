using Domain.Interfaces;
using TimeZoneConverter;

namespace Infrastructure.Services;

public class DateTimeProvider : IDateTimeProvider
{
    private readonly TimeZoneInfo VietNameseTimeZone = TZConvert.GetTimeZoneInfo("Asia/Ho_Chi_Minh");
    public DateTime Now => TimeZoneInfo.ConvertTime(DateTime.UtcNow, VietNameseTimeZone);
}