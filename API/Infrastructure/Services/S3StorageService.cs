using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using Domain.Interfaces;
using Infrastructure.Configurations;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services;

public class S3StorageService : IFileStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly FileStorageSettings _settings;

    public S3StorageService(IOptions<FileStorageSettings> fileStorageSettings)
    {
        _settings = fileStorageSettings.Value;

        // Fallback region (e.g. ap-southeast-1) or Endpoint if you use custom S3 compatible storage
        var region = RegionEndpoint.GetBySystemName(string.IsNullOrWhiteSpace(_settings.Region) ? "ap-southeast-1" : _settings.Region);

        var config = new AmazonS3Config
        {
            RegionEndpoint = region,
            // If you still want to use MinIO as S3 compatible, you can set ServiceURL
            // ServiceURL = _settings.Endpoint,
            // ForcePathStyle = true // Required for MinIO
        };

        if (!string.IsNullOrWhiteSpace(_settings.Endpoint) && !_settings.Endpoint.Contains("amazonaws.com"))
        {
            // Nếu dùng MinIO local (chưa có http/https)
            var prefix = _settings.Endpoint.Contains("localhost") || _settings.Endpoint.Contains("127.0.0.1") ? "http://" : "https://";
            config.ServiceURL = _settings.Endpoint.StartsWith("http") ? _settings.Endpoint : $"{prefix}{_settings.Endpoint}";
            config.ForcePathStyle = true;
        }

        _s3Client = new AmazonS3Client(_settings.AccessKey, _settings.SecretKey, config);
    }

    public async Task DeleteFileAsync(string fileUrl)
    {
        if (string.IsNullOrWhiteSpace(fileUrl)) return;

        var parts = fileUrl.Split('/');
        var objectName = parts.Length > 1 ? parts[^1] : fileUrl;

        var deleteObjectRequest = new DeleteObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = objectName
        };

        await _s3Client.DeleteObjectAsync(deleteObjectRequest);
    }

    public async Task<string> UploadFileAsync(Stream file, string fileName)
    {
        var extension = Path.GetExtension(fileName);
        var storedFileName = $"{Guid.NewGuid()}{extension}";

        var putRequest = new PutObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = storedFileName,
            InputStream = file,
            ContentType = "application/pdf"
        };

        await _s3Client.PutObjectAsync(putRequest);

        var fileUrl = $"{_settings.BucketName}/{storedFileName}";
        return fileUrl;
    }

    public async Task<string> GetDownloadUrlAsync(string fileUrl, int expiryInSeconds = 900)
    {
        if (string.IsNullOrWhiteSpace(fileUrl)) return string.Empty;

        var parts = fileUrl.Split('/');
        var objectName = parts.Length > 1 ? parts[^1] : fileUrl;

        var request = new GetPreSignedUrlRequest
        {
            BucketName = _settings.BucketName,
            Key = objectName,
            Expires = DateTime.UtcNow.AddSeconds(expiryInSeconds)
        };

        return await _s3Client.GetPreSignedURLAsync(request);
    }
}