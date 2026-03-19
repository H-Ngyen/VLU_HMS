using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Patients.Commands.DeletePatient;

public class DeletePatientCommandHandler(ILogger<DeletePatientCommandHandler> logger,
    IPatientsRepository patientsRepository) : IRequestHandler<DeletePatientCommand>
{
    public async Task Handle(DeletePatientCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting the patient with id: {patientId}", request.Id);
        var patient = await patientsRepository.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(Patient), request.Id.ToString());
        
        await patientsRepository.DeleteAsync(patient);
    }
}