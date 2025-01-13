using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnSight.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class InstantSolutionDescriptionColumnAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "instant-solution-description",
                table: "service_calls",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "instant-solution-description",
                table: "service_calls");
        }
    }
}
