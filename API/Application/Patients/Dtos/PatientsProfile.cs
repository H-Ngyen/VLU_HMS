using Application.Patients.Commands.CreatePatient;
using Application.Patients.Commands.UpdatePatient;
using AutoMapper;
using Domain.Entities;

namespace Application.Patients.Dtos;

public class PatientsProfile : Profile
{
    public PatientsProfile()
    {
        CreateMap<CreatePatientCommand, Patient>();
        CreateMap<Patient, PatientDto>();
        CreateMap<UpdatePatientCommand, Patient>();
    }
}