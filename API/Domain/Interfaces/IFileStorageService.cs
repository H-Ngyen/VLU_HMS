namespace Domain.Interfaces;

public interface IFileStorageService
{
    public Task<string> UploadFileAsync(Stream file, string fileName);    
    // public Task<IEnumerable<string>> UploadListFileAsync(IEnumerable<Stream> files);
}