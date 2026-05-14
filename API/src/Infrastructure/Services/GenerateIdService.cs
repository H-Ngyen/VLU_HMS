using Domain.Interfaces;
using Domain.Repositories;

namespace Infrastructure.Services;

public class GenerateIdService(IDateTimeProvider dateTimeProvider,
    IMedicalRecordsRepository medicalRecordsRepository) : IGenerateIdService
{
    private static readonly SemaphoreSlim _lock = new(1, 1);
    private string _lastYear = "-1"; 
    private long _lastId = -1;
    public async Task<string> GenerateStorageId()
    {
        await _lock.WaitAsync();
        try
        {
            // Lấy 2 số cuối của năm hiện tại (ví dụ: "26")
            var yearPrefix = (dateTimeProvider.Now.Year % 100).ToString();

            if(yearPrefix == _lastYear)
                return $"{yearPrefix}.{++_lastId:D6}";
            
            // Tìm mã lớn nhất trong năm hiện tại
            var lastRecord = await medicalRecordsRepository.GetLastStorageIdForYear(yearPrefix);

            if (string.IsNullOrEmpty(lastRecord))
            {
                // Nếu năm mới chưa có ai, bắt đầu từ số 1 (format 6 chữ số)
                _lastYear = yearPrefix;
                _lastId = 0;
                return $"{yearPrefix}.{++_lastId:D6}";
            }

            // Tách phần số thứ tự (Ví dụ: "25.013881" -> "013881")
            var parts = lastRecord.Split('.');
            if (parts.Length < 2 || !long.TryParse(parts[1], out long lastSequence))
            {
                throw new InvalidOperationException("Định dạng số lưu trữ không hợp lệ.");
            }

            // Tăng số thứ tự và format lại với 6 chữ số 0
            long nextSequence = lastSequence + 1;
            _lastId = nextSequence;
            _lastYear = yearPrefix;
            return $"{yearPrefix}.{nextSequence:D6}";
        }
        finally
        {
            _lock.Release();
        }

    }
}