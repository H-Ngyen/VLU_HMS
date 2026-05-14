namespace Domain.Interfaces;

public interface IGeminiClientService
{
    Task<string> GenerateContentAsync(object requestBody);
}