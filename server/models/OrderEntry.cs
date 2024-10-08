using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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
        public Paper? Product { get; set; }

        [Column("order_id")]
        public int OrderId { get; set; }
       
        [JsonIgnore]
        public Order? Order { get; set; }
    }
}