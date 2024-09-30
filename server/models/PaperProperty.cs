namespace Server.Models
{
    public class PaperProperty
    {
        public int PaperId { get; set; }
        public Paper Paper { get; set; }

        public int PropertyId { get; set; }
        public Property Property { get; set; }
    }
}