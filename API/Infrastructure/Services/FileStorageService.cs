using Domain.Interfaces;
using Infrastructure.Configurations;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;

namespace Infrastructure.Services;

public class FileStorageService(IMinioClient minioClient, IOptions<FileStorageSettings> fileStorageSettings) : IFileStorageService
{
    private readonly FileStorageSettings _settings = fileStorageSettings.Value;

    public async Task DeleteFileAsync(string fileUrl)
    {
        if (string.IsNullOrWhiteSpace(fileUrl)) return;

        // The fileUrl is stored as "{bucketName}/{fileName}"
        var parts = fileUrl.Split('/');
        var objectName = parts.Length > 1 ? parts[^1] : fileUrl;

        var removeObjectArgs = new RemoveObjectArgs()
            .WithBucket(_settings.BucketName)
            .WithObject(objectName);

        await minioClient.RemoveObjectAsync(removeObjectArgs);
    }

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
    public async Task<string> GetDownloadUrlAsync(string fileUrl, int expiryInSeconds = 900)
    {
        if (string.IsNullOrWhiteSpace(fileUrl)) return string.Empty;

        var parts = fileUrl.Split('/');
        var objectName = parts.Length > 1 ? parts[^1] : fileUrl;

        var args = new PresignedGetObjectArgs()
            .WithBucket(_settings.BucketName)
            .WithObject(objectName)
            .WithExpiry(expiryInSeconds); // 15p

        return await minioClient.PresignedGetObjectAsync(args);
    }
}