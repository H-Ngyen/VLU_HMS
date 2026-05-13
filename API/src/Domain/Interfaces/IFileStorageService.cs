namespace Domain.Interfaces;

public interface IFileStorageService
{
    public Task<string> UploadFileAsync(Stream file, string fileName);    
    public Task DeleteFileAsync(string fileUrl);
    Task<string> GetDownloadUrlAsync(string fileUrl, int expiryInSeconds = 900);
}