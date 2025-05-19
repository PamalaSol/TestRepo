using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchFramework.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitCascadeDeleteOnLocalizationSets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_LocalizationSet_HousingId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_HousingId",
                table: "Product");

            migrationBuilder.CreateIndex(
                name: "IX_Product_HousingId",
                table: "Product",
                column: "HousingId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Product_LocalizationSet_HousingId",
                table: "Product",
                column: "HousingId",
                principalTable: "LocalizationSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_LocalizationSet_HousingId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_HousingId",
                table: "Product");

            migrationBuilder.CreateIndex(
                name: "IX_Product_HousingId",
                table: "Product",
                column: "HousingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_LocalizationSet_HousingId",
                table: "Product",
                column: "HousingId",
                principalTable: "LocalizationSet",
                principalColumn: "Id");
        }
    }
}
