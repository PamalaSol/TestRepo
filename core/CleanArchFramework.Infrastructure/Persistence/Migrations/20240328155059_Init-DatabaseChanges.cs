using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchFramework.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitDatabaseChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Category_LocalizationSet_DescriptionId",
                table: "Category");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductCategory_LocalizationSet_DescriptionId",
                table: "ProductCategory");

            migrationBuilder.AlterColumn<Guid>(
                name: "DescriptionId",
                table: "ProductCategory",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "DescriptionId",
                table: "Category",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Category_LocalizationSet_DescriptionId",
                table: "Category",
                column: "DescriptionId",
                principalTable: "LocalizationSet",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCategory_LocalizationSet_DescriptionId",
                table: "ProductCategory",
                column: "DescriptionId",
                principalTable: "LocalizationSet",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Category_LocalizationSet_DescriptionId",
                table: "Category");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductCategory_LocalizationSet_DescriptionId",
                table: "ProductCategory");

            migrationBuilder.AlterColumn<Guid>(
                name: "DescriptionId",
                table: "ProductCategory",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "DescriptionId",
                table: "Category",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Category_LocalizationSet_DescriptionId",
                table: "Category",
                column: "DescriptionId",
                principalTable: "LocalizationSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCategory_LocalizationSet_DescriptionId",
                table: "ProductCategory",
                column: "DescriptionId",
                principalTable: "LocalizationSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
