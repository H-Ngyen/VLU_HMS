namespace Domain.Exceptions;

public class ForbidException : ApiException
{
    public ForbidException() : base("Access forbidden")
    { }
    public ForbidException(string message) : base(message)
    { }

    public override int StatusCode => 403;

}