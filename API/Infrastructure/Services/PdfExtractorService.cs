using System.Text.Json;
using Domain.Interfaces;

namespace Infrastructure.Services;

public class PdfProcessorService(IGeminiClientService geminiClient) : IPdfProcessorService
{
    public async Task<T?> ExtractAsync<T>(Stream pdfStream, string prompt, string mimeType = "application/pdf", string responseMimeType = "application/json")
    {
        // convert Stream to Base64
        // note: do not use 'using' here for pdfStream because the caller manage its life cycle
        using var ms = new MemoryStream();
        await pdfStream.CopyToAsync(ms);

        var base64Data = ms.TryGetBuffer(out var buffer)
            ? Convert.ToBase64String(buffer.Array!, buffer.Offset, buffer.Count) 
            : Convert.ToBase64String(ms.ToArray());

        var requestBody = new
        {
            contents = new[] {
                new {
                    parts = new object[] {
                        new { text = prompt },
                        new { inline_data = new { mime_type = mimeType, data = base64Data } }
                    }
                }
            },
            generationConfig = new { response_mime_type = responseMimeType }
        };

        var rawJson = await geminiClient.GenerateContentAsync(requestBody);

        return JsonSerializer.Deserialize<T>(rawJson, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
    }
}