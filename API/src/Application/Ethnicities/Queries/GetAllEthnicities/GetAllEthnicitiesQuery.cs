using Domain.Entities;
using MediatR;

namespace Application.Ethnicities.Queries.GetAllEthnicities;

public class GetAllEthnicitiesQuery : IRequest<IEnumerable<Ethnicity>>
{
    
}