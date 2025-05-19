using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchFramework.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Init_product_sleave : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "MaterialId",
                table: "Product",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Product",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SutibleForId",
                table: "Product",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "PinchValveSleeve",
                columns: table => new
                {
                    PinchValveId = table.Column<Guid>(type: "uuid", nullable: false),
                    SleeveId = table.Column<Guid>(type: "uuid", nullable: false),
                    Version = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PinchValveSleeve", x => new { x.PinchValveId, x.SleeveId, x.Version });
                    table.ForeignKey(
                        name: "FK_PinchValveSleeve_Product_PinchValveId",
                        column: x => x.PinchValveId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PinchValveSleeve_Product_SleeveId",
                        column: x => x.SleeveId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Product_MaterialId",
                table: "Product",
                column: "MaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_Product_SutibleForId",
                table: "Product",
                column: "SutibleForId");

            migrationBuilder.CreateIndex(
                name: "IX_PinchValveSleeve_SleeveId",
                table: "PinchValveSleeve",
                column: "SleeveId");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_LocalizationSet_MaterialId",
                table: "Product",
                column: "MaterialId",
                principalTable: "LocalizationSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Product_LocalizationSet_SutibleForId",
                table: "Product",
                column: "SutibleForId",
                principalTable: "LocalizationSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_LocalizationSet_MaterialId",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_LocalizationSet_SutibleForId",
                table: "Product");

            migrationBuilder.DropTable(
                name: "PinchValveSleeve");

            migrationBuilder.DropIndex(
                name: "IX_Product_MaterialId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_SutibleForId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "MaterialId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "SutibleForId",
                table: "Product");
        }
    }
}
