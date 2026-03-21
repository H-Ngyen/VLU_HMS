using Domain.Entities;
using Domain.Exceptions;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Ethnicities.Queries.GetAllEthnicities;

public class GetAllEthnicitiesQueryHandler(ILogger<GetAllEthnicitiesQueryHandler> logger,
    IEthnicityRepository ethnicityRepository) : IRequestHandler<GetAllEthnicitiesQuery, IEnumerable<Ethnicity>>
{
    public async Task<IEnumerable<Ethnicity>> Handle(GetAllEthnicitiesQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Geting all ethnicity");
        var ethnicities = await ethnicityRepository.GetAllAsync()
            ?? throw new NotFoundException();
        return ethnicities;
    }
}