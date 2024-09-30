namespace Server.Models
{
    public class PaperProperty
    {
        public int PaperId { get; set; }
        public required Paper Paper { get; set; }

        public int PropertyId { get; set; }
        public required Property Property { get; set; }
    }
}