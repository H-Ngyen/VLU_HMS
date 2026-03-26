using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Add_XrayStatusLogs_HematologyStatusLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateOnly>(
                name: "RequestedAt",
                table: "XRays",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "CompletedAt",
                table: "XRays",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "XRays",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "RequestedAt",
                table: "Hematologies",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "CompletedAt",
                table: "Hematologies",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Hematologies",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "HematologyStatusLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HematologyId = table.Column<int>(type: "int", nullable: false),
                    UpdatedById = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    DepartmentName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                name: "XRayStatusLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    XRayId = table.Column<int>(type: "int", nullable: false),
                    UpdatedById = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    DepartmentName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HematologyStatusLogs");

            migrationBuilder.DropTable(
                name: "XRayStatusLogs");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "XRays");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Hematologies");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RequestedAt",
                table: "XRays",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CompletedAt",
                table: "XRays",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "RequestedAt",
                table: "Hematologies",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CompletedAt",
                table: "Hematologies",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);
        }
    }
}
