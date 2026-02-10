namespace Domain.Exceptions;

public class NotFoundException : ApiException
{
    public override int StatusCode => 404;

    public NotFoundException()
        : base("Not Found")
    { }

    public NotFoundException(string message)
        : base(message)
    { }

    public NotFoundException(string resourceType, string resourceIdentifier)
        : base($"{resourceType} with id: {resourceIdentifier} doesn't exist")
    { }
}