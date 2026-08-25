using Application.Auth.Commands.GoogleLogin;
using Domain.Exceptions;
using Domain.Constants;
using Domain.Entities;
using Domain.Repositories;
using Google.Apis.Auth;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Domain.Interfaces;
using Application.Common;

using AutoMapper;

namespace Application.Auth.Commands.GoogleLogin;

public class GoogleLoginCommandHandler(
    IUserRepository userRepository,
    IConfiguration configuration,
    TokenGenerator tokenGenerator,
    IMapper mapper) : IRequestHandler<GoogleLoginCommand, GoogleLoginResponse>
{
    public async Task<GoogleLoginResponse> Handle(GoogleLoginCommand request, CancellationToken cancellationToken)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings()
        {
            Audience = new[] { configuration["GoogleAuth:ClientId"] }
        };

        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);
        }
        catch (InvalidJwtException)
        {
            throw new UnauthorizedException("Invalid Google IdToken");
        }

        if (!payload.Email.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase))
        {
            throw new ForbidException("Only @gmail.com accounts are allowed for Patients.");
        }

        var user = await userRepository.FindOneAsync(u => u.Email == payload.Email);

        if (user == null)
        {
            return mapper.Map<GoogleLoginResponse>(payload);
        }

        var token = await tokenGenerator.GenerateToken(user);
        
        var response = new GoogleLoginResponse
        {
            RequiresOnboarding = false,
            Token = token,
            UserId = user.Id
        };
        
        return response;
    }
}
