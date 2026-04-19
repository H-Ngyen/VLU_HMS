using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixNotificationAndHematology : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserNotification_Notification_NotificationId",
                table: "UserNotification");

            migrationBuilder.DropForeignKey(
                name: "FK_UserNotification_Users_UserId",
                table: "UserNotification");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserNotification",
                table: "UserNotification");

            migrationBuilder.RenameTable(
                name: "UserNotification",
                newName: "UserNotifications");

            migrationBuilder.RenameColumn(
                name: "AppMessage",
                table: "Notification",
                newName: "AppContent");

            migrationBuilder.RenameColumn(
                name: "EmailSendAt",
                table: "UserNotifications",
                newName: "EmailSentAt");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotification_UserId_NotificationId",
                table: "UserNotifications",
                newName: "IX_UserNotifications_UserId_NotificationId");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotification_UserId_IsRead_NotificationId",
                table: "UserNotifications",
                newName: "IX_UserNotifications_UserId_IsRead_NotificationId");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotification_NotificationId",
                table: "UserNotifications",
                newName: "IX_UserNotifications_NotificationId");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotification_IsEmailSend_NotificationId",
                table: "UserNotifications",
                newName: "IX_UserNotifications_IsEmailSend_NotificationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserNotifications",
                table: "UserNotifications",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotifications_Notification_NotificationId",
                table: "UserNotifications",
                column: "NotificationId",
                principalTable: "Notification",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotifications_Users_UserId",
                table: "UserNotifications",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserNotifications_Notification_NotificationId",
                table: "UserNotifications");

            migrationBuilder.DropForeignKey(
                name: "FK_UserNotifications_Users_UserId",
                table: "UserNotifications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserNotifications",
                table: "UserNotifications");

            migrationBuilder.RenameTable(
                name: "UserNotifications",
                newName: "UserNotification");

            migrationBuilder.RenameColumn(
                name: "AppContent",
                table: "Notification",
                newName: "AppMessage");

            migrationBuilder.RenameColumn(
                name: "EmailSentAt",
                table: "UserNotification",
                newName: "EmailSendAt");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotifications_UserId_NotificationId",
                table: "UserNotification",
                newName: "IX_UserNotification_UserId_NotificationId");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotifications_UserId_IsRead_NotificationId",
                table: "UserNotification",
                newName: "IX_UserNotification_UserId_IsRead_NotificationId");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotifications_NotificationId",
                table: "UserNotification",
                newName: "IX_UserNotification_NotificationId");

            migrationBuilder.RenameIndex(
                name: "IX_UserNotifications_IsEmailSend_NotificationId",
                table: "UserNotification",
                newName: "IX_UserNotification_IsEmailSend_NotificationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserNotification",
                table: "UserNotification",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotification_Notification_NotificationId",
                table: "UserNotification",
                column: "NotificationId",
                principalTable: "Notification",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotification_Users_UserId",
                table: "UserNotification",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
