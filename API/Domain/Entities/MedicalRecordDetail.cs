namespace Domain.Entities;

public class MedicalRecordDetail
{
    public int Id { get; set; } // PK & FK to MedicalRecord

    public string? AdmissionReason { get; set; }
    public string? PathologicalProcess { get; set; }
    public string? PersonalHistory { get; set; }
    public string? FamilyHistory { get; set; }

    // Exams
    public string? ExamGeneral { get; set; }
    public string? ExamCardio { get; set; }
    public string? ExamRespiratory { get; set; }
    public string? ExamGastro { get; set; }
    public string? ExamRenalUrology { get; set; }
    public string? ExamNeurological { get; set; }
    public string? ExamMusculoskeletal { get; set; }
    public string? ExamENT { get; set; }
    public string? ExamMaxillofacial { get; set; }
    public string? ExamOphthalmology { get; set; }
    public string? ExamEndocrineOthers { get; set; }
    public string? RequiredClinicalTests { get; set; }
    public string? MedicalSummary { get; set; }

    // Diagnosis
    public string? DiagnosisMain { get; set; }
    public string? DiagnosisSub { get; set; }
    public string? DiagnosisDifferential { get; set; }
    public string? Prognosis { get; set; }
    public string? TreatmentPlan { get; set; }
    
    // Vitals
    public string? PulseRate { get; set; }
    public string? Temperature { get; set; }
    public string? BloodPressure { get; set; }
    public string? RespiratoryRate { get; set; }
    public string? BodyWeight { get; set; }

    // Navigation Properties
    public ICollection<MedicalRecordRiskFactor> RiskFactors { get; set; } = [];
    public MedicalRecord MedicalRecord { get; set; } = null!;
}