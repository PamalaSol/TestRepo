using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CleanArchFramework.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Init3file : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FileCategoryId",
                table: "FileStorage",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FileCategory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NameId = table.Column<Guid>(type: "uuid", nullable: false),
                    DescriptionId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ModifiedBy = table.Column<string>(type: "text", nullable: true),
                    ModifiedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ImageId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileCategory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FileCategory_FileSet_ImageId",
                        column: x => x.ImageId,
                        principalTable: "FileSet",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FileCategory_LocalizationSet_DescriptionId",
                        column: x => x.DescriptionId,
                        principalTable: "LocalizationSet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FileCategory_LocalizationSet_NameId",
                        column: x => x.NameId,
                        principalTable: "LocalizationSet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FileStorage_FileCategoryId",
                table: "FileStorage",
                column: "FileCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_FileCategory_DescriptionId",
                table: "FileCategory",
                column: "DescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_FileCategory_ImageId",
                table: "FileCategory",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_FileCategory_NameId",
                table: "FileCategory",
                column: "NameId");

            migrationBuilder.AddForeignKey(
                name: "FK_FileStorage_FileCategory_FileCategoryId",
                table: "FileStorage",
                column: "FileCategoryId",
                principalTable: "FileCategory",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileStorage_FileCategory_FileCategoryId",
                table: "FileStorage");

            migrationBuilder.DropTable(
                name: "FileCategory");

            migrationBuilder.DropIndex(
                name: "IX_FileStorage_FileCategoryId",
                table: "FileStorage");

            migrationBuilder.DropColumn(
                name: "FileCategoryId",
                table: "FileStorage");
        }
    }
}
