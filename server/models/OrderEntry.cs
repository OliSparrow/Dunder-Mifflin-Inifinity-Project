using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    [Table("order_entries")]
    public class OrderEntry
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("quantity")]
        public int Quantity { get; set; }

        [Column("product_id")]
        public int ProductId { get; set; }
        public required Paper Product { get; set; }

        [Column("order_id")]
        public int OrderId { get; set; }
        public required Order Order { get; set; }
    }
}
