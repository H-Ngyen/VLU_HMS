using System.Security.Claims;
using Domain.Constants;
using Domain.Exceptions;
using Domain.Repositories;
using Microsoft.AspNetCore.Http;

namespace Application.Users;

public interface IUserContext
{
    Task<CurrentUser?> GetCurrentUser();
    UserTokenData GetPayloadTokenUser();
}

public class UserContext(IHttpContextAccessor httpContextAccessor, IUserRepository userRepository) : IUserContext
{
    public async Task<CurrentUser?> GetCurrentUser()
    {
        var payload = GetPayloadTokenUser();
        var user = await userRepository.FindOneAsync(u => u.Auth0Id == payload.Auth0Id)
            ?? throw new UnauthorizedException();

        var role = user.Role.Name;

        var id = user.Id;

        var departmentId = user.DepartmentId;

        if (!user.Active) throw new ForbidException();

        return new CurrentUser(id, payload.Auth0Id, payload.Email, payload.EmailVerified, payload.Name, role, departmentId);
    }

    public UserTokenData GetPayloadTokenUser()
    {
        var user = httpContextAccessor.HttpContext?.User;

        if (user?.Identity == null || !user.Identity.IsAuthenticated)
            throw new UnauthorizedException();

        string GetRequiredClaim(string type, string message)
               => user.FindFirst(type)?.Value ?? throw new UnauthorizedException(message);

        var auth0Id = GetRequiredClaim(ClaimTypes.NameIdentifier, "Auth0Id missing in token");

        var email = GetRequiredClaim(ClaimTypes.Email, "Email missing in token");

        var emailVerifiedClaim = GetRequiredClaim(AppClaimTypes.EmailVerified, "EmailVerified missing in token");

        if (!bool.TryParse(emailVerifiedClaim, out var emailVerified))
            throw new UnauthorizedException("EmailVerified invalid format");

        var name = GetRequiredClaim(AppClaimTypes.Name, "Name missing in token");
        var picture = GetRequiredClaim(AppClaimTypes.Picture, "Picture missing in token");

        var updatedAtClaim = GetRequiredClaim(AppClaimTypes.UpdatedAt, "UpdatedAt missing in token");
        if (!DateTime.TryParse(updatedAtClaim, out var updatedAt))
            throw new UnauthorizedException("UpdatedAt invalid format");

        return new UserTokenData(
            auth0Id,
            email,
            emailVerified,
            picture,
            name,
            updatedAt
        );
    }
}