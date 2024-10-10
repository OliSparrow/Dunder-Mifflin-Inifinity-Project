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
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer.Name))
                .ForMember(dest => dest.CustomerAddress, opt => opt.MapFrom(src => src.Customer.Address))
                .ForMember(dest => dest.CustomerPhone, opt => opt.MapFrom(src => src.Customer.Phone))
                .ForMember(dest => dest.CustomerEmail, opt => opt.MapFrom(src => src.Customer.Email))
                .ForMember(dest => dest.OrderEntries, opt => opt.MapFrom(src => src.OrderEntries));

            // Mapping from OrderDTO to Order
            CreateMap<OrderDTO, Order>()
                .ForMember(dest => dest.Customer, opt => opt.Ignore()) 
                .ForMember(dest => dest.OrderEntries, opt => opt.Ignore()); 

            // Mapping from OrderEntry to OrderEntryDTO
            CreateMap<OrderEntry, OrderEntryDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product.Price));

            // Mapping from OrderEntryDTO to OrderEntry
            CreateMap<OrderEntryDTO, OrderEntry>();
        }
    }
}