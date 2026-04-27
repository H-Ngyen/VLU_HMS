// using Microsoft.AspNetCore.Http;
namespace Domain.Interfaces;

public interface IPdfProcessorService
{
    Task<T?> ExtractAsync<T>(Stream pdfStream, string prompt, string mimeType = "application/pdf", string responseMimeType = "application/json");
}