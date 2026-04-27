using Application.Users;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Hematologies.Commands.DeleteHematology;

public class DeleteHematologyCommandHandler(ILogger<DeleteHematologyCommandHandler> logger,
    IUserContext userContext,
    IHematologyAuthorizationService hematologyAuthorizationService,
    IHematologyRepository hematologyRepository) : IRequestHandler<DeleteHematologyCommand>
{
    public async Task Handle(DeleteHematologyCommand request, CancellationToken cancellationToken)
    {
        var currentUser = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        logger.LogInformation("User {UserEmail} deleting hematology {HematologyId}", currentUser.Email, request.Id);

        var hematology = await hematologyRepository.FindOneAsync(h => h.Id == request.Id) 
            ?? throw new NotFoundException($"Không tìm thấy phiếu chụp xquang {request.Id}");

        if(!hematologyAuthorizationService.Authorize(currentUser, hematology, ResourceOperation.Delete))
            throw new ForbidException();

        await hematologyRepository.DeleteAsync(hematology);
    }
}