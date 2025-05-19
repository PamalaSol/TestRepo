using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchFramework.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitOrderUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "Order",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDifferentAddress",
                table: "Order",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsOrder",
                table: "Order",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PackagingCostNeeded",
                table: "Order",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ShippingCompany",
                table: "Order",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShippingCostNeeded",
                table: "Order",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ShippingCountry",
                table: "Order",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShippingStreet",
                table: "Order",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShippingZip",
                table: "Order",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Street",
                table: "Order",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Zip",
                table: "Order",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Company",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "IsDifferentAddress",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "IsOrder",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "PackagingCostNeeded",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ShippingCompany",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ShippingCostNeeded",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ShippingCountry",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ShippingStreet",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ShippingZip",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Street",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Zip",
                table: "Order");
        }
    }
}
