namespace Domain.Constants;

public record UserTokenData(
    string Auth0Id,
    string Email,
    bool EmailVerified,
    string PictureUrl,
    string Name,
    DateTime UpdateAt)
{ }