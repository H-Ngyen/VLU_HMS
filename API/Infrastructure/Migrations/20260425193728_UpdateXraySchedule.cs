using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateXraySchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BedNumber",
                table: "XRays",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DepartmentOfHealth",
                table: "XRays",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FormNumber",
                table: "XRays",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HospitalName",
                table: "XRays",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoomNumber",
                table: "XRays",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BedNumber",
                table: "XRays");

            migrationBuilder.DropColumn(
                name: "DepartmentOfHealth",
                table: "XRays");

            migrationBuilder.DropColumn(
                name: "FormNumber",
                table: "XRays");

            migrationBuilder.DropColumn(
                name: "HospitalName",
                table: "XRays");

            migrationBuilder.DropColumn(
                name: "RoomNumber",
                table: "XRays");
        }
    }
}
