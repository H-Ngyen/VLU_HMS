
namespace Domain.Interfaces;

public interface IDateTimeProvider
{
    DateTime UtcNow { get; }
    DateTime Now { get; }
    DateTime ConvertToVietnamTime(DateTime dateTime);

}