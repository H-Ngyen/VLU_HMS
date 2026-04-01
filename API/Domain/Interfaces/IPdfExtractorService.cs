// using Microsoft.AspNetCore.Http;
namespace Domain.Interfaces;

public interface IPdfExtractorService
{
    Task<T?> ExtractAsync<T>(Stream pdfStream, string prompt, string mimeType = "application/pdf");
}