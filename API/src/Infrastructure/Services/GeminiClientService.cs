using System.Net.Http.Json;
using System.Text.Json;
using Domain.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services;

public class GeminiClientService(HttpClient httpClient, IConfiguration config) : IGeminiClientService
{
    private readonly string _apiKey = config["Gemini:ApiKey"] ?? throw new InvalidOperationException("Gemini:ApiKey is not configured");
    private readonly string _model = config["Gemini:Model"] ?? throw new InvalidOperationException("Gemini:Model is not configured");
    private readonly string _action = config["Gemini:Action"] ?? throw new InvalidOperationException("Gemini:Action is not configured");
    private string ApiUrl => $"https://generativelanguage.googleapis.com/v1/models/{_model}:{_action}?key={_apiKey}";

    public async Task<string> GenerateContentAsync(object requestBody)
    {
        var response = await httpClient.PostAsJsonAsync(ApiUrl, requestBody);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Google API Error ({(int)response.StatusCode} {response.ReasonPhrase}) for model '{_model}': {errorBody}");
        }

        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        return result.GetProperty("candidates")[0]
                     .GetProperty("content")
                     .GetProperty("parts")[0]
                     .GetProperty("text").GetString() ?? "";
    }
}