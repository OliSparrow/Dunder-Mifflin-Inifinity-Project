using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class PaperRequest
    {
        [Required]
        public required Paper Paper { get; set; }

        public List<int> PropertyIds { get; set; } = new();
    }
}