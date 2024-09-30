using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    [Table("customers")]
    public class Customer
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        public required string Name { get; set; }

        [Column("address")]
        public required string Address { get; set; }

        [Column("phone")]
        public required string Phone { get; set; }

        [Column("email")]
        public required string Email { get; set; }

        public List<Order> Orders { get; set; } = new();
    }
}