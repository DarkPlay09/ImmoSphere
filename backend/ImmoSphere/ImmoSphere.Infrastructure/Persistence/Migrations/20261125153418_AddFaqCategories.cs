using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ImmoSphere.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFaqCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "id_categorie_faq",
                table: "faq",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "categorie_faq",
                columns: table => new
                {
                    id_categorie_faq = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ordre = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categorie_faq", x => x.id_categorie_faq);
                });

            migrationBuilder.InsertData(
                table: "categorie_faq",
                columns: new[] { "id_categorie_faq", "code", "ordre" },
                values: new object[,]
                {
                    { 1, "account", 1 },
                    { 2, "searchProperty", 2 },
                    { 3, "visitsAppointments", 3 },
                    { 4, "publishProperty", 4 },
                    { 5, "notariesReviews", 5 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_faq_id_categorie_faq",
                table: "faq",
                column: "id_categorie_faq");

            migrationBuilder.CreateIndex(
                name: "IX_categorie_faq_code",
                table: "categorie_faq",
                column: "code",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_faq_categorie_faq_id_categorie_faq",
                table: "faq",
                column: "id_categorie_faq",
                principalTable: "categorie_faq",
                principalColumn: "id_categorie_faq",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_faq_categorie_faq_id_categorie_faq",
                table: "faq");

            migrationBuilder.DropTable(
                name: "categorie_faq");

            migrationBuilder.DropIndex(
                name: "IX_faq_id_categorie_faq",
                table: "faq");

            migrationBuilder.DropColumn(
                name: "id_categorie_faq",
                table: "faq");
        }
    }
}
