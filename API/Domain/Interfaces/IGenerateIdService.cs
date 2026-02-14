namespace Domain.Interfaces;

public interface IGenerateIdService
{
    public Task<string> GenerateStorageId();    
}