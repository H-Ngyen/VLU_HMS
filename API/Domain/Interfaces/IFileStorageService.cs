namespace Domain.Interfaces;

public interface IFileStorageService
{
    public Task<string> UploadFileAsync(Stream file, string fileName);    
    public Task DeleteFileAsync(string fileUrl);
}