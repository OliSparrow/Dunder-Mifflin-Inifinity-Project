using System.Collections.Generic;

namespace Server.Models
{
    public class PaperRequest
    {
        public Paper? Paper { get; set; }
        public List<int>? PropertyIds { get; set; }
    }
}