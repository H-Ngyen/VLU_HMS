using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSchema_MedicalRecord_MedicalRecordDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DeathReason",
                table: "MedicalRecords",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MedicalSummary",
                table: "MedicalRecordDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Prognosis",
                table: "MedicalRecordDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RequiredClinicalTests",
                table: "MedicalRecordDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TreatmentPlan",
                table: "MedicalRecordDetails",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeathReason",
                table: "MedicalRecords");

            migrationBuilder.DropColumn(
                name: "MedicalSummary",
                table: "MedicalRecordDetails");

            migrationBuilder.DropColumn(
                name: "Prognosis",
                table: "MedicalRecordDetails");

            migrationBuilder.DropColumn(
                name: "RequiredClinicalTests",
                table: "MedicalRecordDetails");

            migrationBuilder.DropColumn(
                name: "TreatmentPlan",
                table: "MedicalRecordDetails");
        }
    }
}
