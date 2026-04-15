using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixDepartmentEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Users_HeadUserId",
                table: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Departments_HeadUserId",
                table: "Departments");

            migrationBuilder.AddColumn<int>(
                name: "HeadUserId1",
                table: "Departments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_HeadUserId1",
                table: "Departments",
                column: "HeadUserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Users_HeadUserId1",
                table: "Departments",
                column: "HeadUserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Users_HeadUserId1",
                table: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Departments_HeadUserId1",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "HeadUserId1",
                table: "Departments");

            migrationBuilder.CreateIndex(
                name: "IX_Departments_HeadUserId",
                table: "Departments",
                column: "HeadUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Users_HeadUserId",
                table: "Departments",
                column: "HeadUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
