using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ethnicities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ethnicities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AppTitle = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    AppContent = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    EmailTitle = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    EmailContent = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ResourceId = table.Column<int>(type: "integer", nullable: false),
                    ResourceUrl = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notification", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    HeadUserId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    DepartmentId = table.Column<int>(type: "integer", nullable: true),
                    Auth0Id = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    EmailVerify = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PictureUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    CreateAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdateAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EthnicityId = table.Column<int>(type: "integer", nullable: false, defaultValue: 56),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "date", nullable: false),
                    Gender = table.Column<int>(type: "integer", nullable: false),
                    HealthInsuranceNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Patients_Ethnicities_EthnicityId",
                        column: x => x.EthnicityId,
                        principalTable: "Ethnicities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Patients_Users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserNotifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    NotificationId = table.Column<int>(type: "integer", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    ReadAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    IsEmailSend = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    EmailSentAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserNotifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserNotifications_Notification_NotificationId",
                        column: x => x.NotificationId,
                        principalTable: "Notification",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserNotifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicalRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false),
                    RecordType = table.Column<int>(type: "integer", nullable: true),
                    FormCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    StorageCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    MedicalCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    BedCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    JobTitle = table.Column<string>(type: "text", nullable: true),
                    JobTitleCode = table.Column<string>(type: "text", nullable: true),
                    AddressJob = table.Column<string>(type: "text", nullable: true),
                    Address = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    ProvinceCode = table.Column<int>(type: "integer", nullable: true),
                    DistrictCode = table.Column<int>(type: "integer", nullable: true),
                    ProvinceName = table.Column<string>(type: "text", nullable: true),
                    DistrictName = table.Column<string>(type: "text", nullable: true),
                    WardName = table.Column<string>(type: "text", nullable: true),
                    HealthInsuranceExpiryDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    RelativeInfo = table.Column<string>(type: "text", nullable: true),
                    RelativePhone = table.Column<string>(type: "text", nullable: true),
                    PaymentCategory = table.Column<int>(type: "integer", nullable: true),
                    AdmissionTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    AdmissionType = table.Column<int>(type: "integer", nullable: true),
                    ReferralSource = table.Column<int>(type: "integer", nullable: true),
                    AdmissionCount = table.Column<string>(type: "text", nullable: true, defaultValue: "1"),
                    HospitalTransferType = table.Column<int>(type: "integer", nullable: true),
                    HospitalTransferDestination = table.Column<string>(type: "text", nullable: true),
                    DischargeTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    DischargeType = table.Column<int>(type: "integer", nullable: true),
                    TotalTreatmentDays = table.Column<string>(type: "text", nullable: true),
                    ReferralDiagnosis = table.Column<string>(type: "text", nullable: true),
                    ReferralCode = table.Column<string>(type: "text", nullable: true),
                    AdmissionDiagnosis = table.Column<string>(type: "text", nullable: true),
                    AdmissionCode = table.Column<string>(type: "text", nullable: true),
                    DepartmentDiagnosis = table.Column<string>(type: "text", nullable: true),
                    DepartmentCode = table.Column<string>(type: "text", nullable: true),
                    HasProcedure = table.Column<bool>(type: "boolean", nullable: false),
                    HasSurgery = table.Column<bool>(type: "boolean", nullable: false),
                    DischargeMainDiagnosis = table.Column<string>(type: "text", nullable: true),
                    DischargeMainCode = table.Column<string>(type: "text", nullable: true),
                    DischargeSubDiagnosis = table.Column<string>(type: "text", nullable: true),
                    DischargeSubCode = table.Column<string>(type: "text", nullable: true),
                    HasAccident = table.Column<bool>(type: "boolean", nullable: false),
                    HasComplication = table.Column<bool>(type: "boolean", nullable: false),
                    TreatmentResult = table.Column<int>(type: "integer", nullable: true),
                    PathologyResult = table.Column<int>(type: "integer", nullable: true),
                    DeathCause = table.Column<int>(type: "integer", nullable: true),
                    DeathTimeGroup = table.Column<int>(type: "integer", nullable: true),
                    DeathReason = table.Column<string>(type: "text", nullable: true),
                    DeathMainReason = table.Column<string>(type: "text", nullable: true),
                    DeathMainCode = table.Column<int>(type: "integer", nullable: true),
                    HasAutopsy = table.Column<bool>(type: "boolean", nullable: false),
                    DiagnosisAutopsy = table.Column<string>(type: "text", nullable: true),
                    DiagnosisCode = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalRecords_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicalRecords_Users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DepartmentTransfers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MedicalRecordId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    AdmissionTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    TransferType = table.Column<int>(type: "integer", nullable: true),
                    TreatmentDays = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepartmentTransfers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DepartmentTransfers_MedicalRecords_MedicalRecordId",
                        column: x => x.MedicalRecordId,
                        principalTable: "MedicalRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Hematologies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MedicalRecordId = table.Column<int>(type: "integer", nullable: false),
                    RequestedById = table.Column<int>(type: "integer", nullable: false),
                    PerformedById = table.Column<int>(type: "integer", nullable: true),
                    DepartmentOfHealth = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    HospitalName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    FormNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    RoomNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    RequestedAt = table.Column<DateOnly>(type: "date", nullable: true),
                    CompletedAt = table.Column<DateOnly>(type: "date", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    RequestDescription = table.Column<string>(type: "text", nullable: true),
                    RedBloodCellCount = table.Column<float>(type: "real", nullable: true),
                    WhiteBloodCellCount = table.Column<float>(type: "real", nullable: true),
                    Hemoglobin = table.Column<float>(type: "real", nullable: true),
                    Hematocrit = table.Column<float>(type: "real", nullable: true),
                    Mcv = table.Column<float>(type: "real", nullable: true),
                    Mch = table.Column<float>(type: "real", nullable: true),
                    Mchc = table.Column<float>(type: "real", nullable: true),
                    ReticulocyteCount = table.Column<float>(type: "real", nullable: true),
                    PlateletCount = table.Column<float>(type: "real", nullable: true),
                    Neutrophil = table.Column<float>(type: "real", nullable: true),
                    Eosinophil = table.Column<float>(type: "real", nullable: true),
                    Basophil = table.Column<float>(type: "real", nullable: true),
                    Monocyte = table.Column<float>(type: "real", nullable: true),
                    Lymphocyte = table.Column<float>(type: "real", nullable: true),
                    NucleatedRedBloodCell = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    AbnormalCells = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    MalariaParasite = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Esr1h = table.Column<float>(type: "real", nullable: true),
                    Esr2h = table.Column<float>(type: "real", nullable: true),
                    BleedingTime = table.Column<int>(type: "integer", nullable: true),
                    ClottingTime = table.Column<int>(type: "integer", nullable: true),
                    BloodTypeAbo = table.Column<int>(type: "integer", nullable: true),
                    BloodTypeRh = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hematologies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Hematologies_MedicalRecords_MedicalRecordId",
                        column: x => x.MedicalRecordId,
                        principalTable: "MedicalRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Hematologies_Users_PerformedById",
                        column: x => x.PerformedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Hematologies_Users_RequestedById",
                        column: x => x.RequestedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MedicalAttachments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MedicalRecordId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Path = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalAttachments_MedicalRecords_MedicalRecordId",
                        column: x => x.MedicalRecordId,
                        principalTable: "MedicalRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicalRecordDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    IllnessDay = table.Column<int>(type: "integer", nullable: true),
                    AdmissionReason = table.Column<string>(type: "text", nullable: true),
                    PathologicalProcess = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    PersonalHistory = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    FamilyHistory = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    ExamGeneral = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    ExamCardio = table.Column<string>(type: "text", nullable: true),
                    ExamRespiratory = table.Column<string>(type: "text", nullable: true),
                    ExamGastro = table.Column<string>(type: "text", nullable: true),
                    ExamRenalUrology = table.Column<string>(type: "text", nullable: true),
                    ExamNeurological = table.Column<string>(type: "text", nullable: true),
                    ExamMusculoskeletal = table.Column<string>(type: "text", nullable: true),
                    ExamENT = table.Column<string>(type: "text", nullable: true),
                    ExamMaxillofacial = table.Column<string>(type: "text", nullable: true),
                    ExamOphthalmology = table.Column<string>(type: "text", nullable: true),
                    ExamEndocrineOthers = table.Column<string>(type: "text", nullable: true),
                    RequiredClinicalTests = table.Column<string>(type: "text", nullable: true),
                    MedicalSummary = table.Column<string>(type: "text", nullable: true),
                    DiagnosisMain = table.Column<string>(type: "text", nullable: true),
                    DiagnosisSub = table.Column<string>(type: "text", nullable: true),
                    DiagnosisDifferential = table.Column<string>(type: "text", nullable: true),
                    Prognosis = table.Column<string>(type: "text", nullable: true),
                    TreatmentPlan = table.Column<string>(type: "text", nullable: true),
                    PulseRate = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: true),
                    Temperature = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: true),
                    BloodPressure = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    RespiratoryRate = table.Column<string>(type: "text", nullable: true),
                    BodyWeight = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalRecordDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalRecordDetails_MedicalRecords_Id",
                        column: x => x.Id,
                        principalTable: "MedicalRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "XRays",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MedicalRecordId = table.Column<int>(type: "integer", nullable: false),
                    RequestedById = table.Column<int>(type: "integer", nullable: false),
                    PerformedById = table.Column<int>(type: "integer", nullable: true),
                    DepartmentOfHealth = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    HospitalName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    FormNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    RoomNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    RequestDescription = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    RequestedAt = table.Column<DateOnly>(type: "date", nullable: true),
                    ResultDescription = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    DoctorAdvice = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    CompletedAt = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_XRays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_XRays_MedicalRecords_MedicalRecordId",
                        column: x => x.MedicalRecordId,
                        principalTable: "MedicalRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_XRays_Users_PerformedById",
                        column: x => x.PerformedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_XRays_Users_RequestedById",
                        column: x => x.RequestedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HematologyStatusLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HematologyId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedById = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    DepartmentName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HematologyStatusLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HematologyStatusLogs_Hematologies_HematologyId",
                        column: x => x.HematologyId,
                        principalTable: "Hematologies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HematologyStatusLogs_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MedicalRecordRiskFactors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MedicalRecordDetailId = table.Column<int>(type: "integer", nullable: false),
                    Signed = table.Column<int>(type: "integer", nullable: true),
                    IsPossible = table.Column<bool>(type: "boolean", nullable: true, defaultValue: false),
                    DurationMonth = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalRecordRiskFactors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalRecordRiskFactors_MedicalRecordDetails_MedicalRecord~",
                        column: x => x.MedicalRecordDetailId,
                        principalTable: "MedicalRecordDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "XRayStatusLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    XRayId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedById = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    DepartmentName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_XRayStatusLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_XRayStatusLogs_Users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_XRayStatusLogs_XRays_XRayId",
                        column: x => x.XRayId,
                        principalTable: "XRays",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Departments_HeadUserId",
                table: "Departments",
                column: "HeadUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DepartmentTransfers_MedicalRecordId",
                table: "DepartmentTransfers",
                column: "MedicalRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_Hematologies_MedicalRecordId",
                table: "Hematologies",
                column: "MedicalRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_Hematologies_PerformedById",
                table: "Hematologies",
                column: "PerformedById");

            migrationBuilder.CreateIndex(
                name: "IX_Hematologies_RequestedById",
                table: "Hematologies",
                column: "RequestedById");

            migrationBuilder.CreateIndex(
                name: "IX_HematologyStatusLogs_HematologyId",
                table: "HematologyStatusLogs",
                column: "HematologyId");

            migrationBuilder.CreateIndex(
                name: "IX_HematologyStatusLogs_HematologyId_CreatedAt",
                table: "HematologyStatusLogs",
                columns: new[] { "HematologyId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_HematologyStatusLogs_UpdatedById",
                table: "HematologyStatusLogs",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalAttachments_MedicalRecordId",
                table: "MedicalAttachments",
                column: "MedicalRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecordRiskFactors_MedicalRecordDetailId",
                table: "MedicalRecordRiskFactors",
                column: "MedicalRecordDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecords_CreatedBy",
                table: "MedicalRecords",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecords_PatientId",
                table: "MedicalRecords",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_CreatedAt",
                table: "Notification",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_CreatedBy",
                table: "Patients",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_EthnicityId",
                table: "Patients",
                column: "EthnicityId");

            migrationBuilder.CreateIndex(
                name: "IX_UserNotifications_IsEmailSend_NotificationId",
                table: "UserNotifications",
                columns: new[] { "IsEmailSend", "NotificationId" });

            migrationBuilder.CreateIndex(
                name: "IX_UserNotifications_NotificationId",
                table: "UserNotifications",
                column: "NotificationId");

            migrationBuilder.CreateIndex(
                name: "IX_UserNotifications_UserId_IsRead_NotificationId",
                table: "UserNotifications",
                columns: new[] { "UserId", "IsRead", "NotificationId" });

            migrationBuilder.CreateIndex(
                name: "IX_UserNotifications_UserId_NotificationId",
                table: "UserNotifications",
                columns: new[] { "UserId", "NotificationId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Auth0Id",
                table: "Users",
                column: "Auth0Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_DepartmentId",
                table: "Users",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_XRays_MedicalRecordId",
                table: "XRays",
                column: "MedicalRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_XRays_PerformedById",
                table: "XRays",
                column: "PerformedById");

            migrationBuilder.CreateIndex(
                name: "IX_XRays_RequestedById",
                table: "XRays",
                column: "RequestedById");

            migrationBuilder.CreateIndex(
                name: "IX_XRayStatusLogs_UpdatedById",
                table: "XRayStatusLogs",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_XRayStatusLogs_XRayId",
                table: "XRayStatusLogs",
                column: "XRayId");

            migrationBuilder.CreateIndex(
                name: "IX_XRayStatusLogs_XRayId_CreatedAt",
                table: "XRayStatusLogs",
                columns: new[] { "XRayId", "CreatedAt" });

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Users_HeadUserId",
                table: "Departments",
                column: "HeadUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Users_HeadUserId",
                table: "Departments");

            migrationBuilder.DropTable(
                name: "DepartmentTransfers");

            migrationBuilder.DropTable(
                name: "HematologyStatusLogs");

            migrationBuilder.DropTable(
                name: "MedicalAttachments");

            migrationBuilder.DropTable(
                name: "MedicalRecordRiskFactors");

            migrationBuilder.DropTable(
                name: "UserNotifications");

            migrationBuilder.DropTable(
                name: "XRayStatusLogs");

            migrationBuilder.DropTable(
                name: "Hematologies");

            migrationBuilder.DropTable(
                name: "MedicalRecordDetails");

            migrationBuilder.DropTable(
                name: "Notification");

            migrationBuilder.DropTable(
                name: "XRays");

            migrationBuilder.DropTable(
                name: "MedicalRecords");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Ethnicities");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
