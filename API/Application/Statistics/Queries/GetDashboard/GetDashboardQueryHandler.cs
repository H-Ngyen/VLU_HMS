using Application.Statistics.Dtos;
using Domain.Constants;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;

namespace Application.Statistics.Queries.GetDashboard;

public class GetDashboardQuery : IRequest<DashboardDto>
{
    public DateOnly? FromDay { get; set; }
    public DateOnly? ToDay { get; set; }
    public RecordType? RecordType { get; set; }
}

public class GetDashboardQueryHandler(
    IMedicalRecordsRepository medicalRecordsRepository,
    IUserRepository userRepository,
    IStatisticsAuthorizationService authorizationService,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<GetDashboardQuery, DashboardDto>
{
    public async Task<DashboardDto> Handle(GetDashboardQuery request, CancellationToken cancellationToken)
    {
        if (!await authorizationService.Authorize(ResourceOperation.Read))
            throw new ForbidException();

        var now = dateTimeProvider.Now;
        var startOfThisMonth = new DateTime(now.Year, now.Month, 1);
        var startOfLastMonth = startOfThisMonth.AddMonths(-1);

        // 1. Get Clinical Data using getAllAsync
        var allRecordsList = await medicalRecordsRepository.GetAllAsync();
        var queryableRecords = allRecordsList.AsQueryable();

        // 1. Lọc theo mốc ngày
        if (request.FromDay.HasValue)
        {
            var fromDateTime = request.FromDay.Value.ToDateTime(TimeOnly.MinValue);
            queryableRecords = queryableRecords.Where(x => x.CreatedAt >= fromDateTime);
        }
        if (request.ToDay.HasValue)
        {
            var toDateTime = request.ToDay.Value.ToDateTime(TimeOnly.MaxValue);
            queryableRecords = queryableRecords.Where(x => x.CreatedAt <= toDateTime);
        }

        // 2. Lọc theo loại hồ sơ
        if (request.RecordType.HasValue)
        {
            queryableRecords = queryableRecords.Where(x => x.RecordType == request.RecordType.Value);
        }
        var allRecords = queryableRecords.Select(m => new
        {
            m.CreatedAt,
            m.HasSurgery,
            m.HasProcedure,
            m.AdmissionType,
            m.TreatmentResult,
            m.ReferralSource,
            m.DeathTimeGroup,
            m.HasAutopsy,
            m.DischargeTime
        }).ToList();

        var total = allRecords.Count;

        // 2. Summary
        var summary = new SummaryDto
        {
            TotalRecords = total,
            SurgicalRate = total == 0 ? 0 : Math.Round((double)allRecords.Count(r => r.HasSurgery) / total * 100, 1),
            ProcedureRate = total == 0 ? 0 : Math.Round((double)allRecords.Count(r => r.HasProcedure) / total * 100, 1),
            EmergencyRate = total == 0 ? 0 : Math.Round((double)allRecords.Count(r => r.AdmissionType == AdmissionType.Emergency) / total * 100, 1)
        };

        // 3. User Growth using getAllAsync
        var usersList = await userRepository.GetAllAsync() ?? [];
        var users = usersList.Select(u => new { u.CreateAt }).ToList();

        var usersThisMonth = users.Count(u => u.CreateAt >= startOfThisMonth);
        var usersLastMonth = users.Count(u => u.CreateAt >= startOfLastMonth && u.CreateAt < startOfThisMonth);

        double growth = 0;
        if (usersLastMonth > 0)
            growth = Math.Round((double)(usersThisMonth - usersLastMonth) / usersLastMonth * 100, 1);
        else if (usersThisMonth > 0)
            growth = 100;

        var userGrowth = new UserGrowthDto
        {
            NewUsersThisMonth = usersThisMonth,
            NewUsersLastMonth = usersLastMonth,
            GrowthPercentage = Math.Abs(growth),
            IsIncrease = growth >= 0
        };

        // 4. Trends (Last 6 months)
        var trends = new TrendStatsDto();
        for (int i = 5; i >= 0; i--)
        {
            var monthDate = startOfThisMonth.AddMonths(-i);
            var label = monthDate.ToString("MM/yyyy");

            trends.MedicalRecords.Add(new DataPointDto
            {
                Label = label,
                Value = allRecords.Count(r => r.CreatedAt.Year == monthDate.Year && r.CreatedAt.Month == monthDate.Month)
            });

            trends.UserOnboarding.Add(new DataPointDto
            {
                Label = label,
                Value = users.Count(u => u.CreateAt.Year == monthDate.Year && u.CreateAt.Month == monthDate.Month)
            });
        }

        // 5. Distributions
        var outcomeDistribution = Enum.GetValues<TreatmentResult>()
            .Select(e => new DataPointDto
            {
                Label = e.ToString(),
                Value = allRecords.Count(r => r.TreatmentResult == e),
                Percentage = total == 0 ? 0 : Math.Round((double)allRecords.Count(r => r.TreatmentResult == e) / total * 100, 1)
            }).ToList();

        var admissionDistribution = Enum.GetValues<AdmissionType>()
            .Select(e => new DataPointDto
            {
                Label = e.ToString(),
                Value = allRecords.Count(r => r.AdmissionType == e)
            }).ToList();

        // 6. Mortality
        var mortality = new MortalityStatsDto
        {
            Before24h = allRecords.Count(r => r.DeathTimeGroup == DeathTimeGroup.Before24h),
            After24h = allRecords.Count(r => r.DeathTimeGroup == DeathTimeGroup.After24h),
            AutopsyRate = allRecords.Count(r => r.TreatmentResult == TreatmentResult.Death) == 0 ? 0 :
                Math.Round((double)allRecords.Count(r => r.HasAutopsy) / allRecords.Count(r => r.TreatmentResult == TreatmentResult.Death) * 100, 1)
        };

        return new DashboardDto
        {
            Summary = summary,
            UserGrowth = userGrowth,
            Trends = trends,
            OutcomeDistribution = outcomeDistribution,
            AdmissionTypeDistribution = admissionDistribution,
            MortalityStats = mortality
        };
    }
}