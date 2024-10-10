using AutoMapper;
using Server.dtos;
using Server.Models;

namespace Server
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Mapping from Order to OrderDTO
            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Name : string.Empty))
                .ForMember(dest => dest.CustomerAddress, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Address : string.Empty))
                .ForMember(dest => dest.CustomerPhone, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Phone : string.Empty))
                .ForMember(dest => dest.CustomerEmail, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Email : string.Empty))
                .ForMember(dest => dest.OrderEntries, opt => opt.MapFrom(src => src.OrderEntries));

            // Mapping from OrderDTO to Order
            CreateMap<OrderDTO, Order>()
                .ForMember(dest => dest.Customer, opt => opt.Ignore()) 
                .ForMember(dest => dest.OrderEntries, opt => opt.Ignore()); 

            // Mapping from OrderEntry to OrderEntryDTO
            CreateMap<OrderEntry, OrderEntryDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : string.Empty))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product != null ? src.Product.Price : 0));

            // Mapping from OrderEntryDTO to OrderEntry
            CreateMap<OrderEntryDTO, OrderEntry>();
        }
    }
}