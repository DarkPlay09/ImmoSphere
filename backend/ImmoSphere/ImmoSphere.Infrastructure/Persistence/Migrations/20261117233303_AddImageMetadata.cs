using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ImmoSphere.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddImageMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ordre",
                table: "image",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "texte_alternatif",
                table: "image",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ordre",
                table: "image");

            migrationBuilder.DropColumn(
                name: "texte_alternatif",
                table: "image");
        }
    }
}
