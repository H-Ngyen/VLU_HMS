using System.Security.Claims;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Repositories;
using Microsoft.AspNetCore.Http;

namespace Application.Users;

public interface IUserContext
{
    Task<CurrentUser?> GetCurrentUser();
}

public class UserContext(IHttpContextAccessor httpContextAccessor, IUserRepository userRepository) : IUserContext
{
    public async Task<CurrentUser?> GetCurrentUser()
    {
        var user = (httpContextAccessor?.HttpContext?.User) 
            ?? throw new InvalidOperationException("User context is not present");
        
        if (user.Identity == null || !user.Identity.IsAuthenticated)
            return null;

        var auth0Id = user.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new InvalidOperationException("User ID claim is missing");

        var email = user.FindFirst(ClaimTypes.Email)?.Value
            ?? throw new InvalidOperationException("Email claim is missing");

        var emailVerified = bool.TryParse(user.FindFirst("email_verified")?.Value, out var ev) && ev;

        var name = user.FindFirst(ClaimTypes.Name)?.Value;

        var userRole = await userRepository.FindOneAsync(u => u.Auth0Id == auth0Id)
            ?? throw new NotFoundException(nameof(User), $"{auth0Id}");

        var role = userRole.Role.Name;

        var id = userRole.Id;

        return new CurrentUser(id, auth0Id, email, emailVerified, name!, role);
    }
}