using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Property
    {
        [Key]
        public int Id { get; set; }

        public string PropertyName { get; set; }

        public List<PaperProperty> PaperProperties { get; set; }
    }
}