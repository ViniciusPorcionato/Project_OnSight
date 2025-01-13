using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnSight.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class LatitudeAndLongitudeAddedToAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "latitude",
                table: "addresses",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "longitude",
                table: "addresses",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "latitude",
                table: "addresses");

            migrationBuilder.DropColumn(
                name: "longitude",
                table: "addresses");
        }
    }
}
