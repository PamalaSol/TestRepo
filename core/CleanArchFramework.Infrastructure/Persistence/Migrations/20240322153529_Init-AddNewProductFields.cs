using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchFramework.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitAddNewProductFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ConnectionMaterialId",
                table: "Product",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "IndustriesId",
                table: "Product",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ScrewsId",
                table: "Product",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Product_ConnectionMaterialId",
                table: "Product",
                column: "ConnectionMaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_Product_IndustriesId",
                table: "Product",
                column: "IndustriesId");

            migrationBuilder.CreateIndex(
                name: "IX_Product_ScrewsId",
                table: "Product",
                column: "ScrewsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_LocalizationSet_ConnectionMaterialId",
                table: "Product",
                column: "ConnectionMaterialId",
                principalTable: "LocalizationSet",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_LocalizationSet_IndustriesId",
                table: "Product",
                column: "IndustriesId",
                principalTable: "LocalizationSet",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_LocalizationSet_ScrewsId",
                table: "Product",
                column: "ScrewsId",
                principalTable: "LocalizationSet",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_LocalizationSet_ConnectionMaterialId",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_LocalizationSet_IndustriesId",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_LocalizationSet_ScrewsId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_ConnectionMaterialId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_IndustriesId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_ScrewsId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "ConnectionMaterialId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "IndustriesId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "ScrewsId",
                table: "Product");
        }
    }
}
