using Domain.Interfaces;
using Domain.Repositories;

namespace Infrastructure.Services;

public class GenerateIdService(IDateTimeProvider dateTimeProvider,
    IMedicalRecordsRepository medicalRecordsRepository) : IGenerateIdService
{
    public async Task<string> GenerateStorageId()
    {
        // 1. Lấy 2 số cuối của năm hiện tại (ví dụ: "26")
        var yearPrefix = (dateTimeProvider.Now.Year % 100).ToString();

        // 2. Tìm mã lớn nhất trong năm hiện tại
        var lastRecord = await medicalRecordsRepository.GetLastStorageIdForYear(yearPrefix);

        if (string.IsNullOrEmpty(lastRecord))
        {
            // Nếu năm mới chưa có ai, bắt đầu từ số 1 (format 6 chữ số)
            return  $"{yearPrefix}.000001";
        }

        // 3. Tách phần số thứ tự (Ví dụ: "25.013881" -> "013881")
        var parts = lastRecord.Split('.');
        if (parts.Length < 2 || !int.TryParse(parts[1], out int lastSequence))
        {
            throw new InvalidOperationException("Định dạng số lưu trữ không hợp lệ.");
        }

        // 4. Tăng số thứ tự và format lại với 6 chữ số 0
        int nextSequence = lastSequence + 1;
        return $"{yearPrefix}.{nextSequence:D6}";
    } 
}