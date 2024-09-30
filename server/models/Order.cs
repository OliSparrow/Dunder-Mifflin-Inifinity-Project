using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    [Table("orders")]
    public class Order
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("order_date")]
        public DateTime OrderDate { get; set; }

        [Column("delivery_date")]
        public DateTime? DeliveryDate { get; set; }

        [Required]
        [Column("status")]
        public required string Status { get; set; }

        [Required]
        [Column("total_amount")]
        public double TotalAmount { get; set; }

        [Column("customer_id")]
        public int CustomerId { get; set; }
        
public required Customer Customer { get; set; }

        public List<OrderEntry> OrderEntries { get; set; } = new();
    }
}
