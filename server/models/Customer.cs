using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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
        public string Name { get; set; } = string.Empty; 

        [Required]
        [Column("address")]
        public string Address { get; set; } = string.Empty;

        [Required]
        [Phone]
        [Column("phone")]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [JsonIgnore]
        public List<Order> Orders { get; set; } = new();
    }
}