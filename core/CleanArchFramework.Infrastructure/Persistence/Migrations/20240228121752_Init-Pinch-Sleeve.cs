using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchFramework.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitPinchSleeve : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_LocalizationSet_MaterialId",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_LocalizationSet_SutibleForId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_SutibleForId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "SutibleForId",
                table: "Product");

            migrationBuilder.AlterColumn<Guid>(
                name: "MaterialId",
                table: "Product",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "SuitableForId",
                table: "Product",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Product_SuitableForId",
                table: "Product",
                column: "SuitableForId");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_LocalizationSet_MaterialId",
                table: "Product",
                column: "MaterialId",
                principalTable: "LocalizationSet",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_LocalizationSet_SuitableForId",
                table: "Product",
                column: "SuitableForId",
                principalTable: "LocalizationSet",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_LocalizationSet_MaterialId",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_LocalizationSet_SuitableForId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_SuitableForId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "SuitableForId",
                table: "Product");

            migrationBuilder.AlterColumn<Guid>(
                name: "MaterialId",
                table: "Product",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SutibleForId",
                table: "Product",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Product_SutibleForId",
                table: "Product",
                column: "SutibleForId");

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
    }
}
