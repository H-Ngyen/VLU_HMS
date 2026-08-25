using Application.Appointments.Commands.BookAppointment;
using Application.Appointments.Queries.GetMyAppointments;
using AutoMapper;
using Domain.Entities;

namespace Application.Appointments;

public class AppointmentProfile : Profile
{
    public AppointmentProfile()
    {
        CreateMap<Appointment, AppointmentDto>()
            .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.Doctor != null ? src.Doctor.Name : null))
            .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Patient != null ? src.Patient.Name : null));

        CreateMap<Appointment, BookAppointmentResponse>()
            .ForMember(dest => dest.AppointmentId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.DoctorName, opt => opt.Ignore());
    }
}
