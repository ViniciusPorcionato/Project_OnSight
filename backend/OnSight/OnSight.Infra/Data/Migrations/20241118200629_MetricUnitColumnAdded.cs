using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnSight.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class MetricUnitColumnAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "metric_unit",
                table: "metrics_categories",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "metric_unit",
                table: "metrics_categories");
        }
    }
}
