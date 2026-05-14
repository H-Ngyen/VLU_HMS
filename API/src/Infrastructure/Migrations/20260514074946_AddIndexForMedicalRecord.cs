using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIndexForMedicalRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecords_CreatedAt",
                table: "MedicalRecords",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecords_RecordType",
                table: "MedicalRecords",
                column: "RecordType");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecords_StorageCode",
                table: "MedicalRecords",
                column: "StorageCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MedicalRecords_CreatedAt",
                table: "MedicalRecords");

            migrationBuilder.DropIndex(
                name: "IX_MedicalRecords_RecordType",
                table: "MedicalRecords");

            migrationBuilder.DropIndex(
                name: "IX_MedicalRecords_StorageCode",
                table: "MedicalRecords");
        }
    }
}
