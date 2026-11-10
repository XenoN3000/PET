namespace Domain;

public class PhantomSpec
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QcProtocolId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string RecommendedIsotope { get; set; } = string.Empty;
    public string ActivityLevel { get; set; } = string.Empty;
    public string PreparationInstructions { get; set; } = string.Empty;
    public string Dimensions { get; set; } = string.Empty;
}
