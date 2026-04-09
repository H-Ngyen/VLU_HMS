using System.Text.Json;
using System.Text.RegularExpressions;
using Domain.Interfaces;

namespace Infrastructure.Services;

public class PdfProcessorService(IGeminiClientService geminiClient) : IPdfProcessorService
{
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task<T?> ExtractAsync<T>(
        Stream pdfStream, 
        string prompt, 
        string mimeType = "application/pdf", 
        string responseMimeType = "application/json")
    {
        using var ms = new MemoryStream();
        await pdfStream.CopyToAsync(ms);
        var base64Data = Convert.ToBase64String(ms.ToArray());

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new object[]
                    {
                        new { text = prompt },
                        new
                        {
                            inline_data = new
                            {
                                mime_type = mimeType,
                                data = base64Data
                            }
                        }
                    }
                }
            },
            generationConfig = new
            {
                temperature = 0.1
            }
        };

        var rawJson = await geminiClient.GenerateContentAsync(requestBody);

        // Console.WriteLine($"[DEBUG] Raw Gemini Response:\n{rawJson}\n");

        // Xử lý markdown code block
        rawJson = rawJson.Trim();

        // Loại bỏ ```json ... ``` hoặc ``` ... ```
        var match = Regex.Match(rawJson, @"```(?:json)?\s*\n?(.*?)\n?```", RegexOptions.Singleline);
        if (match.Success)
        {
            rawJson = match.Groups[1].Value.Trim();
        }

        // Console.WriteLine($"[DEBUG] Cleaned JSON:\n{rawJson}\n");

        return JsonSerializer.Deserialize<T>(rawJson, _jsonOptions);
    }
}
