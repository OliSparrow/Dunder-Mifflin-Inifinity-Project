namespace Server.Models
{
    public class OrderEntry
    {
        public int Id { get; set; }

        public int Quantity { get; set; }

        public int ProductId { get; set; }
        public Paper Product { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }
    }
}