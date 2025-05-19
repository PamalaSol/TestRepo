using CleanArchFramework.Application.Models.Shared;
using MediatR;
using CleanArchFramework.Application.Features.Product.Commands.CreateProduct;

namespace CleanArchFramework.Application.Features.Product.Commands.UpdateProduct
{
    public class UpdateProductCommand : IRequest<UpdateProductCommandResponse>
    {
        public Guid Id { get; set; }
        public required string Heading { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }

        //Details
        public string? Series { get; set; }
        public string? Dimensions { get; set; }
        public string? Material { get; set; }
        public string? SuitableFor { get; set; }
        public string? Quality { get; set; } //QUALITY FOR SLEEVES/ACCESSORIES
        public string? ConnectionType { get; set; }
        public string? Housing { get; set; }
        public string? NominalWidth { get; set; }
        public string? Size { get; set; } //DN
        public string? ConnectionMaterial { get; set; }
        public string? Screws { get; set; }
        public string? Industries { get; set; }

        public List<PinchValvesSleevesDto>? PinchValvesSleeves { get; set; }
        //public List<GetProductDto>? Sleeves { get; set; }

        public List<int>? ProductCategories { get; set; }
        public List<ExtendedFile>? Images { get; set; }
        public List<ExtendedFile>? Files { get; set; }

    }

}
