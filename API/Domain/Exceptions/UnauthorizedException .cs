namespace Domain.Exceptions;

public class UnauthorizedException : ApiException
{
    public UnauthorizedException() : base("Unauthorized")
    { }

    public UnauthorizedException(string message) : base(message)
    { }

    public override int StatusCode => 401;
}