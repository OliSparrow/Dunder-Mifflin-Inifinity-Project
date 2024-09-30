using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    [Table("paper_properties")]
    public class PaperProperty
    {
        [Column("paper_id")]
        public int PaperId { get; set; }

        [Column("property_id")]
        public int PropertyId { get; set; }

        public required Paper Paper { get; set; }
        public required Property Property { get; set; }
    }
}