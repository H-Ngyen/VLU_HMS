using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Update_MedicalRecord_Entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DischargeDescription",
                table: "MedicalRecords");

            migrationBuilder.AddColumn<DateTime>(
                name: "DischargeTime",
                table: "MedicalRecords",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DischargeTime",
                table: "MedicalRecords");

            migrationBuilder.AddColumn<string>(
                name: "DischargeDescription",
                table: "MedicalRecords",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
