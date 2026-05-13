using Application.Users;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.XRays.Commands.DeleteXray;

public class DeleteXrayCommandHandler(ILogger<DeleteXrayCommandHandler> logger,
    IUserContext userContext,
    IXrayAuthorizationService xrayAuthorizationService,
    IXRayRepository xRayRepository) : IRequestHandler<DeleteXrayCommand>
{
    public async Task Handle(DeleteXrayCommand request, CancellationToken cancellationToken)
    {
        var currentUser = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();

        logger.LogInformation("User {UserEmail} removing the xray {xrayId}", currentUser.Email, request.Id);
        var xray = await xRayRepository.FindOneAsync(x => x.Id == request.Id) ?? throw new NotFoundException(nameof(XRay), $"{request.Id}");

        if (!xrayAuthorizationService.Authorize(currentUser, xray, ResourceOperation.Delete))
            throw new ForbidException();

        await xRayRepository.DeleteAsync(xray);
    }
}