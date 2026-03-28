using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHematologyConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsEmergency",
                table: "Hematologies");

            migrationBuilder.AddColumn<string>(
                name: "RequestDescription",
                table: "Hematologies",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestDescription",
                table: "Hematologies");

            migrationBuilder.AddColumn<bool>(
                name: "IsEmergency",
                table: "Hematologies",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
