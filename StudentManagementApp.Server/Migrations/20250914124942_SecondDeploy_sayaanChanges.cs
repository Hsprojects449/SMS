using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolApp.Migrations
{
    /// <inheritdoc />
    public partial class SecondDeploy_sayaanChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Experience",
                table: "Teachers",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "ProfilePicture",
                table: "TeacherApplicants",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Experience",
                table: "TeacherApplicants",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "AadhaarNo",
                table: "TeacherApplicants",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "BloodGroup",
                table: "TeacherApplicants",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Nationality",
                table: "TeacherApplicants",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Religion",
                table: "TeacherApplicants",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "ProfilePicture",
                table: "StudentApplicants",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "AadhaarNo",
                table: "StudentApplicants",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "BloodGroup",
                table: "StudentApplicants",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Caste",
                table: "StudentApplicants",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Nationality",
                table: "StudentApplicants",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "StudentApplicants",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Religion",
                table: "StudentApplicants",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AadhaarNo",
                table: "TeacherApplicants");

            migrationBuilder.DropColumn(
                name: "BloodGroup",
                table: "TeacherApplicants");

            migrationBuilder.DropColumn(
                name: "Nationality",
                table: "TeacherApplicants");

            migrationBuilder.DropColumn(
                name: "Religion",
                table: "TeacherApplicants");

            migrationBuilder.DropColumn(
                name: "AadhaarNo",
                table: "StudentApplicants");

            migrationBuilder.DropColumn(
                name: "BloodGroup",
                table: "StudentApplicants");

            migrationBuilder.DropColumn(
                name: "Caste",
                table: "StudentApplicants");

            migrationBuilder.DropColumn(
                name: "Nationality",
                table: "StudentApplicants");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "StudentApplicants");

            migrationBuilder.DropColumn(
                name: "Religion",
                table: "StudentApplicants");

            migrationBuilder.AlterColumn<decimal>(
                name: "Experience",
                table: "Teachers",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "TeacherApplicants",
                keyColumn: "ProfilePicture",
                keyValue: null,
                column: "ProfilePicture",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "ProfilePicture",
                table: "TeacherApplicants",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<decimal>(
                name: "Experience",
                table: "TeacherApplicants",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "StudentApplicants",
                keyColumn: "ProfilePicture",
                keyValue: null,
                column: "ProfilePicture",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "ProfilePicture",
                table: "StudentApplicants",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
