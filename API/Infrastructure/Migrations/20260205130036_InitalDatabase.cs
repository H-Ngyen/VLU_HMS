using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitalDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ethnicities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ethnicities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    Auth0Id = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
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
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EthnicityId = table.Column<int>(type: "int", nullable: false, defaultValue: 56),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "date", nullable: false),
                    Gender = table.Column<int>(type: "int", nullable: false),
                    HealthInsuranceNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                name: "MedicalRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    RecordType = table.Column<int>(type: "int", nullable: true),
                    FormCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    StorageCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    MedicalCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    BedCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    JobTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    JobTitleCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AddressJob = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ProvinceCode = table.Column<int>(type: "int", nullable: true),
                    DistrictCode = table.Column<int>(type: "int", nullable: true),
                    ProvinceName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DistrictName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WardName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HealthInsuranceExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RelativeInfo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RelativePhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaymentCategory = table.Column<int>(type: "int", nullable: true),
                    AdmissionTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AdmissionType = table.Column<int>(type: "int", nullable: true),
                    ReferralSource = table.Column<int>(type: "int", nullable: true),
                    AdmissionCount = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValue: "1"),
                    HospitalTransferType = table.Column<int>(type: "int", nullable: true),
                    HospitalTransferDestination = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DischargeDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DischargeType = table.Column<int>(type: "int", nullable: true),
                    TotalTreatmentDays = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReferralDiagnosis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReferralCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdmissionDiagnosis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdmissionCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DepartmentDiagnosis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DepartmentCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HasProcedure = table.Column<bool>(type: "bit", nullable: false),
                    HasSurgery = table.Column<bool>(type: "bit", nullable: false),
                    DischargeMainDiagnosis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DischargeMainCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DischargeSubDiagnosis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DischargeSubCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HasAccident = table.Column<bool>(type: "bit", nullable: false),
                    HasComplication = table.Column<bool>(type: "bit", nullable: false),
                    TreatmentResult = table.Column<int>(type: "int", nullable: true),
                    PathologyResult = table.Column<int>(type: "int", nullable: true),
                    DeathCause = table.Column<int>(type: "int", nullable: true),
                    DeathTimeGroup = table.Column<int>(type: "int", nullable: true),
                    DeathMainReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeathMainCode = table.Column<int>(type: "int", nullable: true),
                    HasAutopsy = table.Column<bool>(type: "bit", nullable: false),
                    DiagnosisAutopsy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DiagnosisCode = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalRecordId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    AdmissionTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TransferType = table.Column<int>(type: "int", nullable: true),
                    TreatmentDays = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true)
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
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalRecordId = table.Column<int>(type: "int", nullable: false),
                    RequestedById = table.Column<int>(type: "int", nullable: false),
                    PerformedById = table.Column<int>(type: "int", nullable: true),
                    IsEmergency = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    RequestedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
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
                    NucleatedRedBloodCell = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    AbnormalCells = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MalariaParasite = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Esr1h = table.Column<float>(type: "real", nullable: true),
                    Esr2h = table.Column<float>(type: "real", nullable: true),
                    BleedingTime = table.Column<int>(type: "int", nullable: true),
                    ClottingTime = table.Column<int>(type: "int", nullable: true),
                    BloodTypeAbo = table.Column<int>(type: "int", nullable: true),
                    BloodTypeRh = table.Column<int>(type: "int", nullable: true)
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
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalRecordId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Path = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
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
                    Id = table.Column<int>(type: "int", nullable: false),
                    AdmissionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PathologicalProcess = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    PersonalHistory = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    FamilyHistory = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    ExamGeneral = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    ExamCardio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamRespiratory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamGastro = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamRenalUrology = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamNeurological = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamMusculoskeletal = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamENT = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamMaxillofacial = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamOphthalmology = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamEndocrineOthers = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DiagnosisMain = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DiagnosisSub = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DiagnosisDifferential = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PulseRate = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    Temperature = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    BloodPressure = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    RespiratoryRate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BodyWeight = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false)
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
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalRecordId = table.Column<int>(type: "int", nullable: false),
                    RequestedById = table.Column<int>(type: "int", nullable: false),
                    PerformedById = table.Column<int>(type: "int", nullable: true),
                    RequestDescription = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    RequestedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResultDescription = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    DoctorAdvice = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                name: "MedicalRecordRiskFactors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalRecordDetailId = table.Column<int>(type: "int", nullable: false),
                    Signed = table.Column<int>(type: "int", nullable: true),
                    IsPossible = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    DurationMonth = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalRecordRiskFactors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalRecordRiskFactors_MedicalRecordDetails_MedicalRecordDetailId",
                        column: x => x.MedicalRecordDetailId,
                        principalTable: "MedicalRecordDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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
                name: "IX_Patients_CreatedBy",
                table: "Patients",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_EthnicityId",
                table: "Patients",
                column: "EthnicityId");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DepartmentTransfers");

            migrationBuilder.DropTable(
                name: "Hematologies");

            migrationBuilder.DropTable(
                name: "MedicalAttachments");

            migrationBuilder.DropTable(
                name: "MedicalRecordRiskFactors");

            migrationBuilder.DropTable(
                name: "XRays");

            migrationBuilder.DropTable(
                name: "MedicalRecordDetails");

            migrationBuilder.DropTable(
                name: "MedicalRecords");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Ethnicities");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
