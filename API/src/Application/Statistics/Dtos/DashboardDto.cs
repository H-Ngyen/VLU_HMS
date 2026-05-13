namespace Application.Statistics.Dtos;

public class DashboardDto
{
    public SummaryDto Summary { get; set; } = null!;
    public UserGrowthDto UserGrowth { get; set; } = null!;
    public TrendStatsDto Trends { get; set; } = null!;
    public List<DataPointDto> OutcomeDistribution { get; set; } = [];
    public List<DataPointDto> AdmissionTypeDistribution { get; set; } = [];
    public MortalityStatsDto MortalityStats { get; set; } = null!;
}

public class SummaryDto
{
    public int TotalRecords { get; set; }
    public double SurgicalRate { get; set; }
    public double ProcedureRate { get; set; }
    public double EmergencyRate { get; set; }
}

public class UserGrowthDto
{
    public int NewUsersThisMonth { get; set; }
    public int NewUsersLastMonth { get; set; }
    public double GrowthPercentage { get; set; }
    public bool IsIncrease { get; set; }
}

public class TrendStatsDto
{
    public List<DataPointDto> MedicalRecords { get; set; } = [];
    public List<DataPointDto> UserOnboarding { get; set; } = [];
}

public class DataPointDto
{
    public string Label { get; set; } = string.Empty;
    public int Value { get; set; }
    public double? Percentage { get; set; }
}

public class MortalityStatsDto
{
    public int Before24h { get; set; }
    public int After24h { get; set; }
    public double AutopsyRate { get; set; }
}