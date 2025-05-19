using System.Net;
using System.Net.Http.Json;
using CleanArchFramework.Application.Features.Product.Commands.CreateProduct;
using CleanArchFramework.Application.Features.Product.Commands.UpdateProduct;
using CleanArchFramework.Application.Features.Product.Query.GetProduct;
using CleanArchFramework.Application.Shared.Result;
using FluentAssertions;
using Xunit.Abstractions;

namespace CleanArchFramework.API.IntegrationTests
{
    [Collection("Product Controller Integration Tests")]
    public class ProductControllerIntegrationTests
    {
        private HttpClient _client;
        private readonly ITestOutputHelper _output;

        [Fact]
        public async Task Product_AddProduct()
        {

            var factory = new CleanArchFrameworkWebApplicationFactory<Program>();
            _client = factory.CreateClient();
            CreateProductCommand product = new CreateProductCommand
            {
                Heading = "Test heading!",
                Description = "Test description!",
                Content = "Test content!",
                Housing = "Test housing!",
                ConnectionType = "Test connection type!",
                ConnectionMaterial = "Connection material!",
                Dimensions = "Test Dimension!",
                Industries = "Test industries!",
                Material = "Test material!",
                NominalWidth = "Test width!",
                Quality = "Test quality!",
                Screws = "Test screws!",
                Series = "Test series!",
                Size = "Test size!",
                SuitableFor = "Test suitableFor!",
                ProductCategories = new List<int>(new[] { 1 })

            };

            var formData = new MultipartFormDataContent();
            _client.DefaultRequestHeaders.Add("accept", "text/plain");
            _client.DefaultRequestHeaders.Add("Accept-Language", "de-DE");
            // Add each property of the product object as a StringContent to the formData
            formData.Add(new StringContent(product.Heading), "Heading");
            formData.Add(new StringContent(product.Description), "Description");
            formData.Add(new StringContent(product.Content), "Content");
            formData.Add(new StringContent(product.Housing), "Housing");
            formData.Add(new StringContent(product.ConnectionType), "ConnectionType");
            formData.Add(new StringContent(product.ConnectionMaterial), "ConnectionMaterial");
            formData.Add(new StringContent(product.Dimensions), "Dimensions");
            formData.Add(new StringContent(product.Industries), "Industries");
            formData.Add(new StringContent(product.Material), "Material");
            formData.Add(new StringContent(product.NominalWidth), "NominalWidth");
            formData.Add(new StringContent(product.Quality), "Quality");
            formData.Add(new StringContent(product.Screws), "Screws");
            formData.Add(new StringContent(product.Series), "Series");
            formData.Add(new StringContent(product.Size), "Size");
            formData.Add(new StringContent(product.SuitableFor), "SuitableFor");

            // Convert the list of product categories to comma-separated string and add it as StringContent
            string categories = string.Join(",", product.ProductCategories);
            formData.Add(new StringContent(categories), "ProductCategories");

            // Act
            var response = await _client.PostAsync("/api/Product", formData);
            // Assert
            response.EnsureSuccessStatusCode(); // Status Code 200-299

            var matchResponse = await response.Content.ReadFromJsonAsync<Result<CreateProductDto>>();
            matchResponse?.IsSuccessful.Should().BeTrue();
            matchResponse?.Data.Should().NotBeNull();
            matchResponse?.Data?.Id.Should().NotBeEmpty();
            matchResponse?.Data?.Housing.Should().Be(product.Housing);


            // Act
            var getResponse = await _client.GetAsync($"/api/Product/{product.ProductCategories.FirstOrDefault()}/{matchResponse?.Data?.Id}");
            var getMatchResponse = await getResponse.Content.ReadFromJsonAsync<Result<GetProductDto>>();
            getMatchResponse?.IsSuccessful.Should().BeTrue();
            getMatchResponse?.Data.Should().NotBeNull();
            getMatchResponse?.Data?.Id.Should().NotBeEmpty();
            getMatchResponse?.Data?.Housing.Should().Be(product.Housing);
            getMatchResponse?.Data?.Heading.Should().Be(product.Heading);
            getMatchResponse?.Data?.Description.Should().Be(product.Description);
            getMatchResponse?.Data?.Content.Should().Be(product.Content);
            getMatchResponse?.Data?.Housing.Should().Be(product.Housing);
            getMatchResponse?.Data?.ConnectionType.Should().Be(product.ConnectionType);
            getMatchResponse?.Data?.ConnectionMaterial.Should().Be(product.ConnectionMaterial);
            getMatchResponse?.Data?.Dimensions.Should().Be(product.Dimensions);
            getMatchResponse?.Data?.Industries.Should().Be(product.Industries);
            getMatchResponse?.Data?.Material.Should().Be(product.Material);
            getMatchResponse?.Data?.NominalWidth.Should().Be(product.NominalWidth);
            getMatchResponse?.Data?.Quality.Should().Be(product.Quality);
            getMatchResponse?.Data?.Screws.Should().Be(product.Screws);
            getMatchResponse?.Data?.Series.Should().Be(product.Series);
            getMatchResponse?.Data?.Size.Should().Be(product.Size);
            getMatchResponse?.Data?.SuitableFor.Should().Be(product.SuitableFor);

            var deleteResponse = await _client.DeleteAsync($"/api/Product/{matchResponse?.Data?.Id}");
            deleteResponse.Should().NotBeNull();
            deleteResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task Product_UpdateProduct()
        {
            var factory = new CleanArchFrameworkWebApplicationFactory<Program>();
            _client = factory.CreateClient();
            CreateProductCommand product = new CreateProductCommand
            {
                Heading = "Test heading!",
                Description = "Test description!",
                Content = "Test content!",
                Housing = "Test housing!",
                ConnectionType = "Test connection type!",
                ConnectionMaterial = "Connection material!",
                Dimensions = "Test Dimension!",
                Industries = "Test industries!",
                Material = "Test material!",
                NominalWidth = "Test width!",
                Quality = "Test quality!",
                Screws = "Test screws!",
                Series = "Test series!",
                Size = "Test size!",
                SuitableFor = "Test suitableFor!",
                ProductCategories = new List<int>(new[] { 1 })

            };

            var formData = new MultipartFormDataContent();
            _client.DefaultRequestHeaders.Add("accept", "text/plain");
            _client.DefaultRequestHeaders.Add("Accept-Language", "de-DE");


            // Add each property of the product object as a StringContent to the formData
            formData.Add(new StringContent(product.Heading), "Heading");
            formData.Add(new StringContent(product.Description), "Description");
            formData.Add(new StringContent(product.Content), "Content");
            formData.Add(new StringContent(product.Housing), "Housing");
            formData.Add(new StringContent(product.ConnectionType), "ConnectionType");
            formData.Add(new StringContent(product.ConnectionMaterial), "ConnectionMaterial");
            formData.Add(new StringContent(product.Dimensions), "Dimensions");
            formData.Add(new StringContent(product.Industries), "Industries");
            formData.Add(new StringContent(product.Material), "Material");
            formData.Add(new StringContent(product.NominalWidth), "NominalWidth");
            formData.Add(new StringContent(product.Quality), "Quality");
            formData.Add(new StringContent(product.Screws), "Screws");
            formData.Add(new StringContent(product.Series), "Series");
            formData.Add(new StringContent(product.Size), "Size");
            formData.Add(new StringContent(product.SuitableFor), "SuitableFor");

            // Convert the list of product categories to comma-separated string and add it as StringContent
            string categories = string.Join(",", product.ProductCategories);
            formData.Add(new StringContent(categories), "ProductCategories");

            // Act
            var response = await _client.PostAsync("/api/Product", formData);
            // Assert
            response.EnsureSuccessStatusCode(); // Status Code 200-299


            var matchResponse = await response.Content.ReadFromJsonAsync<Result<CreateProductDto>>();
            matchResponse?.IsSuccessful.Should().BeTrue();
            matchResponse?.Data.Should().NotBeNull();
            matchResponse?.Data?.Id.Should().NotBeEmpty();
            matchResponse?.Data?.Housing.Should().Be(product.Housing);


            UpdateProductCommand updateProduct = new UpdateProductCommand
            {
                Id = (Guid)matchResponse?.Data?.Id,
                Heading = "Test heading!",
                Description = "Test description!",


            };
            // Update the product object with new values
            updateProduct.Heading = "Updated heading!";
            updateProduct.Description = "Updated description!";
            updateProduct.Content = "Updated content!";
            updateProduct.Housing = "Updated housing!";
            updateProduct.ConnectionType = "Updated connection type!";
            updateProduct.ConnectionMaterial = "Updated connection material!";
            updateProduct.Dimensions = "Updated dimensions!";
            updateProduct.Industries = "Updated industries!";
            updateProduct.Material = "Updated material!";
            updateProduct.NominalWidth = "Updated width!";
            updateProduct.Quality = "Updated quality!";
            updateProduct.Screws = "Updated screws!";
            updateProduct.Series = "Updated series!";
            updateProduct.Size = "Updated size!";
            updateProduct.SuitableFor = "Updated suitableFor!";
            updateProduct.ProductCategories = new List<int>(new[] { 2 }); // Update categories

            // Create a new MultipartFormDataContent
            var updateFormData = new MultipartFormDataContent();

            // Add each updated property of the product object as a StringContent to the updateFormData
            updateFormData.Add(new StringContent(updateProduct.Id.ToString()), "Id");
            updateFormData.Add(new StringContent(updateProduct.Heading), "Heading");
            updateFormData.Add(new StringContent(updateProduct.Description), "Description");
            updateFormData.Add(new StringContent(updateProduct.Content), "Content");
            updateFormData.Add(new StringContent(updateProduct.Housing), "Housing");
            updateFormData.Add(new StringContent(updateProduct.ConnectionType), "ConnectionType");
            updateFormData.Add(new StringContent(updateProduct.ConnectionMaterial), "ConnectionMaterial");
            updateFormData.Add(new StringContent(updateProduct.Dimensions), "Dimensions");
            updateFormData.Add(new StringContent(updateProduct.Industries), "Industries");
            updateFormData.Add(new StringContent(updateProduct.Material), "Material");
            updateFormData.Add(new StringContent(updateProduct.NominalWidth), "NominalWidth");
            updateFormData.Add(new StringContent(updateProduct.Quality), "Quality");
            updateFormData.Add(new StringContent(updateProduct.Screws), "Screws");
            updateFormData.Add(new StringContent(updateProduct.Series), "Series");
            updateFormData.Add(new StringContent(updateProduct.Size), "Size");
            updateFormData.Add(new StringContent(updateProduct.SuitableFor), "SuitableFor");
            string categories2 = string.Join(",", updateProduct.ProductCategories);
            formData.Add(new StringContent(categories2), "ProductCategories");

            var getResponseFromUpdate = await _client.PutAsync("/api/Product", updateFormData);
            var getMatchResponseFromUpdate = await getResponseFromUpdate.Content.ReadFromJsonAsync<Result<UpdateProductDto>>();
            getMatchResponseFromUpdate?.IsSuccessful.Should().BeTrue();
            getMatchResponseFromUpdate?.Data.Should().NotBeNull();
            getMatchResponseFromUpdate?.Data?.Id.Should().NotBeEmpty();
            getMatchResponseFromUpdate?.Data?.Housing.Should().Be(updateProduct.Housing);


            // Act
            var getResponseAfterUpdate = await _client.GetAsync($"/api/GetProduct/{matchResponse?.Data?.Id}");
            var getMatchResponseAfterUpdate = await getResponseAfterUpdate.Content.ReadFromJsonAsync<Result<GetProductDto>>();
            getMatchResponseAfterUpdate?.IsSuccessful.Should().BeTrue();
            getMatchResponseAfterUpdate?.Data.Should().NotBeNull();
            getMatchResponseAfterUpdate?.Data?.Id.Should().NotBeEmpty();
            getMatchResponseAfterUpdate?.Data?.Housing.Should().Be(updateProduct.Housing);
            getMatchResponseAfterUpdate?.Data?.Heading.Should().Be(updateProduct.Heading);
            getMatchResponseAfterUpdate?.Data?.Description.Should().Be(updateProduct.Description);
            getMatchResponseAfterUpdate?.Data?.Content.Should().Be(updateProduct.Content);
            getMatchResponseAfterUpdate?.Data?.Housing.Should().Be(updateProduct.Housing);
            getMatchResponseAfterUpdate?.Data?.ConnectionType.Should().Be(updateProduct.ConnectionType);
            getMatchResponseAfterUpdate?.Data?.ConnectionMaterial.Should().Be(updateProduct.ConnectionMaterial);
            getMatchResponseAfterUpdate?.Data?.Dimensions.Should().Be(updateProduct.Dimensions);
            getMatchResponseAfterUpdate?.Data?.Industries.Should().Be(updateProduct.Industries);
            getMatchResponseAfterUpdate?.Data?.Material.Should().Be(updateProduct.Material);
            getMatchResponseAfterUpdate?.Data?.NominalWidth.Should().Be(updateProduct.NominalWidth);
            getMatchResponseAfterUpdate?.Data?.Quality.Should().Be(updateProduct.Quality);
            getMatchResponseAfterUpdate?.Data?.Screws.Should().Be(updateProduct.Screws);
            getMatchResponseAfterUpdate?.Data?.Series.Should().Be(updateProduct.Series);
            getMatchResponseAfterUpdate?.Data?.Size.Should().Be(updateProduct.Size);
            getMatchResponseAfterUpdate?.Data?.SuitableFor.Should().Be(updateProduct.SuitableFor);

            var deleteResponse = await _client.DeleteAsync($"/api/Product/{matchResponse?.Data?.Id}");
            deleteResponse.Should().NotBeNull();
            deleteResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        }


    }
}