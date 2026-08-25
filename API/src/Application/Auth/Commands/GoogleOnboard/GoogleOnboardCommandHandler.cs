using Domain.Exceptions;
using Domain.Constants;
using Domain.Entities;
using Domain.Repositories;
using Google.Apis.Auth;
using MediatR;
using Microsoft.Extensions.Configuration;
using Domain.Interfaces;
using Application.Common;

using AutoMapper;

namespace Application.Auth.Commands.GoogleOnboard;

public class GoogleOnboardCommandHandler(
    IUserRepository userRepository,
    IPatientsRepository patientsRepository,
    IUserRoleRepository roleRepository,
    IConfiguration configuration,
    IDateTimeProvider timeProvider,
    TokenGenerator tokenGenerator,
    IMapper mapper) : IRequestHandler<GoogleOnboardCommand, GoogleOnboardResponse>
{
    public async Task<GoogleOnboardResponse> Handle(GoogleOnboardCommand request, CancellationToken cancellationToken)
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

        var existingUser = await userRepository.FindOneAsync(u => u.Email == payload.Email);
        if (existingUser != null)
        {
            throw new BadRequestException("User already onboarded.");
        }

        var role = await roleRepository.GetUserRoleAsync(r => r.Name == UserRoles.Patient);
        if (role == null)
        {
            throw new Exception("Patient role not found.");
        }

        // Create User
        var user = mapper.Map<User>(payload);
        user.RoleId = role.Id;
        user.CreateAt = timeProvider.Now;
        user.UpdateAt = timeProvider.Now;
        
        await userRepository.CreateAsync(user);

        // Check if Patient exists by HealthInsuranceNumber
        var existingPatient = await patientsRepository.FindOneAsync(p => p.HealthInsuranceNumber == request.HealthInsuranceNumber);

        if (existingPatient != null)
        {
            // Link existing patient to new user
            existingPatient.UserId = user.Id;
            existingPatient.Name = payload.Name;
            existingPatient.DateOfBirth = request.DateOfBirth;
            existingPatient.Gender = request.Gender;
            existingPatient.EthnicityId = request.EthnicityId;
            await patientsRepository.UpdateAsync(existingPatient);
        }
        else
        {
            // Create new patient
            var newPatient = mapper.Map<Patient>(request);
            newPatient.Name = payload.Name;
            newPatient.CreatedBy = user.Id;
            newPatient.CreatedAt = timeProvider.Now;
            newPatient.UserId = user.Id;
            
            await patientsRepository.CreateAsync(newPatient);
        }

        await userRepository.SaveChanges();
        await patientsRepository.SaveChanges();

        var token = await tokenGenerator.GenerateToken(user);
        
        return new GoogleOnboardResponse
        {
            Token = token,
            UserId = user.Id
        };
    }
}
