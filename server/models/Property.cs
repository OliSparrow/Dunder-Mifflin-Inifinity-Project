using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Property
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string PropertyName { get; set; }

        public required List<PaperProperty> PaperProperties { get; set; }
    }
}