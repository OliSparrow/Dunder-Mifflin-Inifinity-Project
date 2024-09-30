namespace Server.Models
{
    public class Order
    {
        public int Id { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public required string Status { get; set; } 

        public required Customer Customer { get; set; }

        public required List<OrderEntry> OrderEntries { get; set; } = new List<OrderEntry>(); 
    }
}