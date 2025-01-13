using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnSight.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class FistMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "addresses",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    cep = table.Column<string>(type: "char(8)", maxLength: 8, nullable: false),
                    number = table.Column<string>(type: "text", nullable: false),
                    complement = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_addresses", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "metrics_categories",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    metric_description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_metrics_categories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_type_id = table.Column<int>(type: "integer", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    phone_number = table.Column<string>(type: "char(11)", nullable: false),
                    password_hash = table.Column<byte[]>(type: "bytea", nullable: false),
                    password_salt = table.Column<byte[]>(type: "bytea", nullable: false),
                    password_recover_code = table.Column<string>(type: "char(4)", nullable: true),
                    profile_image_url = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "metric_histories",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    metric_category_id = table.Column<Guid>(type: "uuid", nullable: false),
                    value = table.Column<decimal>(type: "numeric", nullable: false),
                    percentual_delta = table.Column<decimal>(type: "numeric", nullable: false),
                    metric_date_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_metric_histories", x => x.id);
                    table.ForeignKey(
                        name: "FK_metric_histories_metrics_categories_metric_category_id",
                        column: x => x.metric_category_id,
                        principalTable: "metrics_categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "clients",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    trade_name = table.Column<string>(type: "text", nullable: false),
                    company_name = table.Column<string>(type: "text", nullable: false),
                    cnpj = table.Column<string>(type: "char(14)", maxLength: 14, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clients", x => x.id);
                    table.ForeignKey(
                        name: "FK_clients_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "individual_persons",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    cpf = table.Column<string>(type: "char(11)", maxLength: 11, nullable: false),
                    rg = table.Column<string>(type: "char(9)", maxLength: 9, nullable: false),
                    birth_date = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_individual_persons", x => x.id);
                    table.ForeignKey(
                        name: "FK_individual_persons_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "technicians",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    technician_status_id = table.Column<int>(type: "integer", nullable: false),
                    individual_person_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_technicians", x => x.id);
                    table.ForeignKey(
                        name: "FK_technicians_individual_persons_individual_person_id",
                        column: x => x.individual_person_id,
                        principalTable: "individual_persons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "service_calls",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    technician_id = table.Column<Guid>(type: "uuid", nullable: false),
                    responsible_attendant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    client_id = table.Column<Guid>(type: "uuid", nullable: false),
                    service_type_id = table.Column<int>(type: "integer", nullable: false),
                    call_status_id = table.Column<int>(type: "integer", nullable: false),
                    urgency_status_id = table.Column<int>(type: "integer", nullable: false),
                    address_id = table.Column<Guid>(type: "uuid", nullable: false),
                    call_code = table.Column<string>(type: "char(11)", maxLength: 11, nullable: true),
                    contact_email = table.Column<string>(type: "text", nullable: false),
                    contact_phone_number = table.Column<string>(type: "char(11)", maxLength: 11, nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    deadline = table.Column<DateOnly>(type: "date", nullable: false),
                    creation_date_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    attribution_date_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    arrival_date_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    conclusion_date_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    is_recurring_call = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_service_calls", x => x.id);
                    table.ForeignKey(
                        name: "FK_service_calls_addresses_address_id",
                        column: x => x.address_id,
                        principalTable: "addresses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_service_calls_clients_client_id",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_service_calls_individual_persons_responsible_attendant_id",
                        column: x => x.responsible_attendant_id,
                        principalTable: "individual_persons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_service_calls_technicians_technician_id",
                        column: x => x.technician_id,
                        principalTable: "technicians",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "unavailability_records",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    technician_id = table.Column<Guid>(type: "uuid", nullable: false),
                    reason_description = table.Column<string>(type: "text", nullable: false),
                    estimated_duration_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    created_on = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_unavailability_records", x => x.id);
                    table.ForeignKey(
                        name: "FK_unavailability_records_technicians_technician_id",
                        column: x => x.technician_id,
                        principalTable: "technicians",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_clients_user_id",
                table: "clients",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_individual_persons_user_id",
                table: "individual_persons",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_metric_histories_metric_category_id",
                table: "metric_histories",
                column: "metric_category_id");

            migrationBuilder.CreateIndex(
                name: "IX_service_calls_address_id",
                table: "service_calls",
                column: "address_id");

            migrationBuilder.CreateIndex(
                name: "IX_service_calls_client_id",
                table: "service_calls",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_service_calls_responsible_attendant_id",
                table: "service_calls",
                column: "responsible_attendant_id");

            migrationBuilder.CreateIndex(
                name: "IX_service_calls_technician_id",
                table: "service_calls",
                column: "technician_id");

            migrationBuilder.CreateIndex(
                name: "IX_technicians_individual_person_id",
                table: "technicians",
                column: "individual_person_id");

            migrationBuilder.CreateIndex(
                name: "IX_unavailability_records_technician_id",
                table: "unavailability_records",
                column: "technician_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_email",
                table: "users",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "metric_histories");

            migrationBuilder.DropTable(
                name: "service_calls");

            migrationBuilder.DropTable(
                name: "unavailability_records");

            migrationBuilder.DropTable(
                name: "metrics_categories");

            migrationBuilder.DropTable(
                name: "addresses");

            migrationBuilder.DropTable(
                name: "clients");

            migrationBuilder.DropTable(
                name: "technicians");

            migrationBuilder.DropTable(
                name: "individual_persons");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
