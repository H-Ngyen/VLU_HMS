using Domain.Interfaces;
using Infrastructure.Configurations;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;

namespace Infrastructure.Services;

public class FileStorageService (IMinioClient minioClient, IOptions<FileStorageSettings> fileStorageSettings): IFileStorageService
{
    private readonly FileStorageSettings _settings = fileStorageSettings.Value;
    public async Task<string> UploadFileAsync(Stream file, string fileName)
    {
        var extension = Path.GetExtension(fileName);
        var storedFileName = $"{Guid.NewGuid()}{extension}";

        var putObjectArgs = new PutObjectArgs()
            .WithBucket(_settings.BucketName)
            .WithObject(storedFileName)
            .WithStreamData(file)
            .WithObjectSize(file.Length)
            .WithContentType("application/pdf");

        await minioClient.PutObjectAsync(putObjectArgs);
        var fileUrl = $"{_settings.BucketName}/{storedFileName}";
        return fileUrl;
    }
}