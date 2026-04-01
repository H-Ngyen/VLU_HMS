using System.Net.Http.Json;
using System.Text.Json;
using Domain.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services;

public class GeminiClientService(HttpClient httpClient, IConfiguration config) : IGeminiClientService
{
    private readonly string _apiKey = config["Gemini:ApiKey"]!;
    private readonly string _url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    public async Task<string> GenerateContentAsync(object requestBody)
    {
        var response = await httpClient.PostAsJsonAsync($"{_url}?key={_apiKey}", requestBody);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        return result.GetProperty("candidates")[0]
                     .GetProperty("content")
                     .GetProperty("parts")[0]
                     .GetProperty("text").GetString() ?? "";
    }
}