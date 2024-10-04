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

        public Paper? Paper { get; set; }
        public Property? Property { get; set; }
    }
}