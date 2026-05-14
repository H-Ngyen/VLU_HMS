using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIndexForPatient : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Patients_CreatedAt",
                table: "Patients",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_HealthInsuranceNumber",
                table: "Patients",
                column: "HealthInsuranceNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_Name",
                table: "Patients",
                column: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Patients_CreatedAt",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Patients_HealthInsuranceNumber",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Patients_Name",
                table: "Patients");
        }
    }
}
