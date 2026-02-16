namespace Domain.Exceptions;

public class BadRequestException : ApiException
{
    public override int StatusCode => 400;

    public BadRequestException()
        : base("Invalid request")
    { }

    public BadRequestException(string message)
        : base(message)
    { }

    public BadRequestException(string resourceType, string resourceIdentifier)
        : base($"{resourceType} with id: {resourceIdentifier} doesn't exist")
    { }
}