using System.ComponentModel.DataAnnotations;

namespace Server.dtos
{
    public class OrderEntryDTO
    {
        public int ProductId { get; set; }

        public int Quantity { get; set; }

        public string ProductName { get; set; } = string.Empty;
        public double Price { get; set; }
    }
}