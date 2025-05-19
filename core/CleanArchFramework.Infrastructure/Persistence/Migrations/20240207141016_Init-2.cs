using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchFramework.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Init2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_About_FileStorage_BackgroundImageId",
                table: "About");

            migrationBuilder.DropForeignKey(
                name: "FK_About_FileStorage_ImageId",
                table: "About");

            migrationBuilder.DropForeignKey(
                name: "FK_Post_FileStorage_ImageId",
                table: "Post");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductCategory_FileStorage_ImageId",
                table: "ProductCategory");

            migrationBuilder.DropTable(
                name: "Podcast");

            migrationBuilder.DropIndex(
                name: "IX_About_BackgroundImageId",
                table: "About");

            migrationBuilder.DropColumn(
                name: "BackgroundImageId",
                table: "About");

            migrationBuilder.AddForeignKey(
                name: "FK_About_FileSet_ImageId",
                table: "About",
                column: "ImageId",
                principalTable: "FileSet",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Post_FileSet_ImageId",
                table: "Post",
                column: "ImageId",
                principalTable: "FileSet",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCategory_FileSet_ImageId",
                table: "ProductCategory",
                column: "ImageId",
                principalTable: "FileSet",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_About_FileSet_ImageId",
                table: "About");

            migrationBuilder.DropForeignKey(
                name: "FK_Post_FileSet_ImageId",
                table: "Post");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductCategory_FileSet_ImageId",
                table: "ProductCategory");

            migrationBuilder.AddColumn<Guid>(
                name: "BackgroundImageId",
                table: "About",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Podcast",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ApplicationUserId = table.Column<string>(type: "text", nullable: true),
                    PodcastPictureId = table.Column<Guid>(type: "uuid", nullable: true),
                    Archived = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateOfPurchase = table.Column<string>(type: "text", nullable: true),
                    EpisodeTitle = table.Column<string>(type: "text", nullable: true),
                    FeaturedPodcast = table.Column<bool>(type: "boolean", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: true),
                    MessageNextPunk = table.Column<string>(type: "text", nullable: true),
                    ModifiedBy = table.Column<string>(type: "text", nullable: true),
                    ModifiedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PodcastLength = table.Column<string>(type: "text", nullable: true),
                    PodcastNo = table.Column<int>(type: "integer", nullable: false),
                    PrimaryPunk = table.Column<string>(type: "text", nullable: true),
                    PunkFewWords = table.Column<string>(type: "text", nullable: true),
                    RecordDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SecondaryPunk = table.Column<string>(type: "text", nullable: true),
                    Spotify = table.Column<string>(type: "text", nullable: true),
                    Summary = table.Column<string>(type: "text", nullable: true),
                    Youtube = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Podcast", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Podcast_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Podcast_FileStorage_PodcastPictureId",
                        column: x => x.PodcastPictureId,
                        principalTable: "FileStorage",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_About_BackgroundImageId",
                table: "About",
                column: "BackgroundImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Podcast_ApplicationUserId",
                table: "Podcast",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Podcast_PodcastPictureId",
                table: "Podcast",
                column: "PodcastPictureId");

            migrationBuilder.AddForeignKey(
                name: "FK_About_FileStorage_BackgroundImageId",
                table: "About",
                column: "BackgroundImageId",
                principalTable: "FileStorage",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_About_FileStorage_ImageId",
                table: "About",
                column: "ImageId",
                principalTable: "FileStorage",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Post_FileStorage_ImageId",
                table: "Post",
                column: "ImageId",
                principalTable: "FileStorage",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCategory_FileStorage_ImageId",
                table: "ProductCategory",
                column: "ImageId",
                principalTable: "FileStorage",
                principalColumn: "Id");
        }
    }
}
