using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnSight.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class IsRequiredChangedForServiceCallColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_service_calls_individual_persons_responsible_attendant_id",
                table: "service_calls");

            migrationBuilder.DropForeignKey(
                name: "FK_service_calls_technicians_technician_id",
                table: "service_calls");

            migrationBuilder.AlterColumn<int>(
                name: "urgency_status_id",
                table: "service_calls",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<Guid>(
                name: "technician_id",
                table: "service_calls",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "responsible_attendant_id",
                table: "service_calls",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "deadline",
                table: "service_calls",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AlterColumn<DateTime>(
                name: "creation_date_time",
                table: "service_calls",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "conclusion_date_time",
                table: "service_calls",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "call_code",
                table: "service_calls",
                type: "char(11)",
                maxLength: 11,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "char(11)",
                oldMaxLength: 11,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "attribution_date_time",
                table: "service_calls",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "arrival_date_time",
                table: "service_calls",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddForeignKey(
                name: "FK_service_calls_individual_persons_responsible_attendant_id",
                table: "service_calls",
                column: "responsible_attendant_id",
                principalTable: "individual_persons",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_service_calls_technicians_technician_id",
                table: "service_calls",
                column: "technician_id",
                principalTable: "technicians",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_service_calls_individual_persons_responsible_attendant_id",
                table: "service_calls");

            migrationBuilder.DropForeignKey(
                name: "FK_service_calls_technicians_technician_id",
                table: "service_calls");

            migrationBuilder.AlterColumn<int>(
                name: "urgency_status_id",
                table: "service_calls",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "technician_id",
                table: "service_calls",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "responsible_attendant_id",
                table: "service_calls",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "deadline",
                table: "service_calls",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1),
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "creation_date_time",
                table: "service_calls",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "conclusion_date_time",
                table: "service_calls",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "call_code",
                table: "service_calls",
                type: "char(11)",
                maxLength: 11,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "char(11)",
                oldMaxLength: 11);

            migrationBuilder.AlterColumn<DateTime>(
                name: "attribution_date_time",
                table: "service_calls",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "arrival_date_time",
                table: "service_calls",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_service_calls_individual_persons_responsible_attendant_id",
                table: "service_calls",
                column: "responsible_attendant_id",
                principalTable: "individual_persons",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_service_calls_technicians_technician_id",
                table: "service_calls",
                column: "technician_id",
                principalTable: "technicians",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
