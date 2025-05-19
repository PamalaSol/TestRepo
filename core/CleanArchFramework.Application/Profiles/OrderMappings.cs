using CleanArchFramework.Domain.Entities;
using Mapster;
using CleanArchFramework.Application.Features.Order.OrderStatus;

namespace CleanArchFramework.Application.Profiles
{
    public class OrderStatusMappings : IRegister
    {
        void IRegister.Register(TypeAdapterConfig config)
        {
            var helper = new SharedMappingHelper();
            config.NewConfig<OrderStatus, OrderStatusDto>()
                .Map(dest => dest.Description, src => helper.MapFromTranslation(src.Description))
                .Map(dest => dest.Name, src => helper.MapFromTranslation(src.Name));

        }
    }
}
