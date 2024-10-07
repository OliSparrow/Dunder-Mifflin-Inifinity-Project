using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class PaperRequest
    {
        [Required]
        public Paper Paper { get; set; }

        public List<int>? PropertyIds { get; set; }
    }
}