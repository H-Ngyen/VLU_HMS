using MediatR;

namespace Application.Auth.Commands.GoogleLogin;

public class GoogleLoginResponse
{
    public bool RequiresOnboarding { get; set; }
    public string? Token { get; set; }
    public int? UserId { get; set; }
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string? PictureUrl { get; set; }
}

public class GoogleLoginCommand : IRequest<GoogleLoginResponse>
{
    public required string IdToken { get; set; }
}
