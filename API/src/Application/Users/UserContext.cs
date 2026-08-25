using System.Security.Claims;
using Domain.Constants;
using Domain.Exceptions;
using Domain.Entities;
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
        
        User? user;
        if (int.TryParse(payload.Auth0Id, out var userId))
        {
            user = await userRepository.FindOneAsync(u => u.Id == userId);
        }
        else
        {
            user = await userRepository.FindOneAsync(u => u.Auth0Id == payload.Auth0Id);
        }

        if (user == null)
            throw new UnauthorizedException();

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

        var emailVerifiedClaim = user.FindFirst(AppClaimTypes.EmailVerified)?.Value;
        var emailVerified = emailVerifiedClaim != null && bool.TryParse(emailVerifiedClaim, out var ev) ? ev : true;

        var name = GetRequiredClaim(AppClaimTypes.Name, "Name missing in token");
        var picture = user.FindFirst(AppClaimTypes.Picture)?.Value ?? string.Empty;

        var updatedAtClaim = user.FindFirst(AppClaimTypes.UpdatedAt)?.Value;
        var updatedAt = updatedAtClaim != null && DateTime.TryParse(updatedAtClaim, out var ua) ? ua : DateTime.UtcNow;

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