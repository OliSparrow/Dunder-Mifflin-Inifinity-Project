using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace Server.Models
{
    [Table("properties")]
    public class Property
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("property_name")]
        public required string PropertyName { get; set; }

        [JsonIgnore]
        public List<PaperProperty> PaperProperties { get; set; } = new();
    }
}