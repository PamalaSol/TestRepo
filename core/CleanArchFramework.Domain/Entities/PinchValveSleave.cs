namespace CleanArchFramework.Domain.Entities
{
    public class PinchValveSleeve 
    {
        public virtual Guid PinchValveId { get; set; }
        public virtual Product PinchValve { get; set; }
        public virtual Guid SleeveId { get; set; }
        public virtual Product Sleeve { get; set; }
        public string Version { get; set; }
    }
}
