using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Paper
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public bool Discontinued { get; set; }

        public int Stock { get; set; }

        public double Price { get; set; }

        public List<PaperProperty> PaperProperties { get; set; }
    }
}