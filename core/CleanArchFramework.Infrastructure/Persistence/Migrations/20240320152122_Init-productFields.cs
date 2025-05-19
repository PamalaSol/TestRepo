using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchFramework.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitproductFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ConnectionType",
                table: "Product",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "HousingId",
                table: "Product",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NominalWidth",
                table: "Product",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Quality",
                table: "Product",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Size",
                table: "Product",
                type: "text",
                nullable: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_LocalizationSet_HousingId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_HousingId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "ConnectionType",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "HousingId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "NominalWidth",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Quality",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "Product");
        }
    }
}
