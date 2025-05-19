using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchFramework.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitconnectionTypeLocalizible : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConnectionType",
                table: "Product");

            migrationBuilder.AddColumn<Guid>(
                name: "ConnectionTypeId",
                table: "Product",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Product_ConnectionTypeId",
                table: "Product",
                column: "ConnectionTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_LocalizationSet_ConnectionTypeId",
                table: "Product",
                column: "ConnectionTypeId",
                principalTable: "LocalizationSet",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_LocalizationSet_ConnectionTypeId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_ConnectionTypeId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "ConnectionTypeId",
                table: "Product");

            migrationBuilder.AddColumn<string>(
                name: "ConnectionType",
                table: "Product",
                type: "text",
                nullable: true);
        }
    }
}
