using Application.Departments.Dtos;
using MediatR;

namespace Application.Departments.Queries.GetAllDepartments;

public class GetAllDepartmentQuery : IRequest<IEnumerable<DepartmentDto>?>
{
    
}