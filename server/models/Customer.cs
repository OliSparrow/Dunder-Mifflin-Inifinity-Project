using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        public required string Address { get; set; }
        
        public required string Phone { get; set; }
        
        public required string Email { get; set; }

        public required List<Order> Orders { get; set; }
    }
}