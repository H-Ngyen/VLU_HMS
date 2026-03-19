using MediatR;

namespace Application.Patients.Commands.DeletePatient;

public class DeletePatientCommand(int id) : IRequest
{
    public int Id { get; set; } = id;
}