using System.ComponentModel;
using CleanArchFramework.Application.Models.Shared;
using MediatR;

namespace CleanArchFramework.Application.Features.Product.Commands.CreateProduct
{
    public class CreateProductCommand : IRequest<CreateProductCommandResponse>
    {
        //General
        public required string Heading { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }

        //Details
        public string? Series { get; set; }
        public string? Dimensions { get; set; }
        public string? Quality { get; set; } //QUALITY FOR SLEEVES/ACCESSORIES
        public string? ConnectionType { get; set; }
        public string? Housing { get; set; }
        public string? NominalWidth { get; set; }
        public string? Size { get; set; } //DN

        public string? Material { get; set; }
        public string? SuitableFor { get; set; }
        public string? ConnectionMaterial { get; set; }
        public string? Screws { get; set; }
        public string? Industries { get; set; }

        public List<PinchValvesSleevesDto>? PinchValvesSleeves { get; set; }
        public List<PinchValvesSleevesDto>? SleevesPinchValves { get; set; }

        public List<int>? ProductCategories { get; set; }
        [Localizable(true)]
        public List<ExtendedFile>? Images { get; set; }
        [Localizable(true)]
        public List<ExtendedFile>? Files { get; set; }


    }

}
