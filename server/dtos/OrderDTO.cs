using System;
using System.Collections.Generic;

namespace Server.dtos
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string Status { get; set; } = "Pending";
        public double TotalAmount { get; set; }

        // Customer Information for new customer creation
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerAddress { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;

        // Order entries
        public List<OrderEntryDTO> OrderEntries { get; set; } = new();
    }
}