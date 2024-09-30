namespace Server.Models
{
    public class OrderEntry
    {
        public int Id { get; set; }

        public int Quantity { get; set; }

        public int ProductId { get; set; }
        public required Paper Product { get; set; }

        public int OrderId { get; set; }
        public required Order Order { get; set; }
    }
}