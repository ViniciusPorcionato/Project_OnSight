using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnSight.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenamingInstantSolutionDescriptionColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "instant-solution-description",
                table: "service_calls",
                newName: "instant_solution_description");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "instant_solution_description",
                table: "service_calls",
                newName: "instant-solution-description");
        }
    }
}
