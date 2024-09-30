using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Paper
    {
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public double Price { get; set; }

        [Required]
        public int Stock { get; set; }

        [Required]
        public bool Discontinued { get; set; }

        public List<PaperProperty> PaperProperties { get; set; } = new();
    }
}