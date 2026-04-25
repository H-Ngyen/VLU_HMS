using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHematologySchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DepartmentOfHealth",
                table: "Hematologies",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FormNumber",
                table: "Hematologies",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HospitalName",
                table: "Hematologies",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoomNumber",
                table: "Hematologies",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DepartmentOfHealth",
                table: "Hematologies");

            migrationBuilder.DropColumn(
                name: "FormNumber",
                table: "Hematologies");

            migrationBuilder.DropColumn(
                name: "HospitalName",
                table: "Hematologies");

            migrationBuilder.DropColumn(
                name: "RoomNumber",
                table: "Hematologies");
        }
    }
}
