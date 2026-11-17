namespace Domain;

public class PhantomSpecTranslation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PhantomSpecId { get; set; }
    public string Language { get; set; } = "en"; // "en" or "fa"
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string RecommendedIsotope { get; set; } = string.Empty;
    public string ActivityLevel { get; set; } = string.Empty;
    public string PreparationInstructions { get; set; } = string.Empty;
    public string Dimensions { get; set; } = string.Empty;
}
