using CleanArchFramework.Application.Contracts.Infrastructure.Communication;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Options.ConfigOptions;
using CleanArchFramework.Application.Shared.Result;
using MapsterMapper;
using MediatR;
using Microsoft.Extensions.Options;


namespace CleanArchFramework.Application.Features.Order.Commands.CreateOrder
{
    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, CreateOrderCommandResponse>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        private readonly IEmailService _emailService;
        private readonly EmailOptions _options;
        public CreateOrderCommandHandler(IOrderRepository orderRepository, IMapper mapper, IUnitOfWork unitOfWork, IEmailService emailService, IOptions<EmailOptions> options)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _emailService = emailService;
            _options = options.Value;
        }

        public async Task<CreateOrderCommandResponse> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            var createOrderCommandResponse = new CreateOrderCommandResponse();
            var validator = new CreateOrderCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.Errors.Count > 0)
            {
                createOrderCommandResponse.IsSuccessful = false;
                foreach (var error in validationResult.Errors)
                {
                    createOrderCommandResponse.WithError(error.ErrorMessage);
                }
            }
            else
            {
                createOrderCommandResponse.Succeed();

                //foreach (var item in request.OrderedItems)
                //{
                //    decimal tempItemAmount = 0;
                //    var valveProduct = await _productRepository.GetFirstProductNoTrackingAsync(x => x.Id == item.ValveProductId);
                //    var sleeveProduct = await _productRepository.GetFirstProductNoTrackingAsync(x => x.Id == item.SleeveProductId);
                //    var accessoriesProduct = await _productRepository.GetFirstProductNoTrackingAsync(x => x.Id == item.AccessoriesProductId);
                //    if (valveProduct == null && sleeveProduct == null && accessoriesProduct == null)
                //    {
                //        tempItemAmount = item.Price;
                //    }
                //    else
                //    {
                //        tempItemAmount += CalculateTotal((decimal)valveProduct.Price, 1, 0, 0).Item4;
                //        tempItemAmount += CalculateTotal((decimal)sleeveProduct.Price, 1, 0, 0).Item4;
                //        tempItemAmount += CalculateTotal((decimal)accessoriesProduct.Price, 1, 0, 0).Item4;
                //    }
                //    request.OrderAmount += tempItemAmount;
                //}

                var mappedOrder = _mapper.Map<Domain.Entities.Order>(request);
                mappedOrder.OrderStatusId = 1;
                var order = await _orderRepository.AddAsync(mappedOrder);

                await _unitOfWork.SaveAsync(cancellationToken);
                var orderAdded = await _orderRepository.GetOrderAsync(order.Id);


                List<string> sendTo = new()
                {
                    _options.ContactEmail,
                    request.Email
                };
                string emailContent = CreateOrderEmailTemplate.Generate(request);
                await _emailService.SendEmailAsync(sendTo, $"HO-Matic - {(request.IsOrder ? "Order" : "Request")} details", emailContent);
                createOrderCommandResponse.Data = _mapper.Map<CreateOrderDto>(orderAdded);
                return createOrderCommandResponse;
            }

            return createOrderCommandResponse;
        }


        public static Tuple<decimal, decimal, decimal, decimal> CalculateTotal(decimal amount, int quantity, decimal tax, decimal discount)
        {
            var discountedPricePerItem = amount - (amount * (discount / (decimal)100.00));

            var discountedPriceQuantity = discountedPricePerItem * quantity;

            var amountTax = (discountedPriceQuantity * ((decimal)tax / (decimal)100.00));

            var finalAmount = (decimal)discountedPriceQuantity + (decimal)amountTax;
            return new Tuple<decimal, decimal, decimal, decimal>(discountedPricePerItem, discountedPriceQuantity, amountTax, finalAmount);
        }
    }
}
