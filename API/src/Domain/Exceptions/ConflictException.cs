namespace Domain.Exceptions;

public class ConflictException : ApiException
{
    public override int StatusCode => 409;

    public ConflictException()
        : base("Resource already exists")
    { }

    public ConflictException(string message)
        : base(message)
    { }

    public ConflictException(string resourceType, string conflictingValue)
        : base($"{resourceType} with '{conflictingValue}' already exists")
    { }
}