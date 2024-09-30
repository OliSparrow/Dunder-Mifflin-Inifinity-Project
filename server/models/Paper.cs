using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    [Table("paper")]
    public class Paper
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        public required string Name { get; set; }

        [Required]
        [Column("price")]
        public double Price { get; set; }

        [Required]
        [Column("stock")]
        public int Stock { get; set; }

        [Required]
        [Column("discontinued")]
        public bool Discontinued { get; set; }

        public List<PaperProperty> PaperProperties { get; set; } = new();
    }
}