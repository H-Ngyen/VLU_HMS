using Domain.Interfaces;
using TimeZoneConverter;

namespace Infrastructure.Services;

public class DateTimeProvider : IDateTimeProvider
{
    private readonly TimeZoneInfo VietNameseTimeZone = TZConvert.GetTimeZoneInfo("Asia/Ho_Chi_Minh");
    public DateTime UtcNow  => DateTime.UtcNow;
    public DateTime Now => TimeZoneInfo.ConvertTime(DateTime.UtcNow, VietNameseTimeZone);
    public DateTime ConvertToVietnamTime(DateTime dateTime)
        => TimeZoneInfo.ConvertTime(dateTime, VietNameseTimeZone);
    
    // public DateTime ConvertToVietnamTime(DateTime dateTime)
    // {
    //     return dateTime.Kind switch
    //     {
    //         DateTimeKind.Utc => TimeZoneInfo.ConvertTimeFromUtc(dateTime, VietNameseTimeZone),

    //         DateTimeKind.Local => TimeZoneInfo.ConvertTime(dateTime, VietNameseTimeZone),

    //         DateTimeKind.Unspecified => TimeZoneInfo.ConvertTimeFromUtc(
    //             DateTime.SpecifyKind(dateTime, DateTimeKind.Utc),
    //             VietNameseTimeZone
    //         ),

    //         _ => dateTime
    //     };
    // }
}