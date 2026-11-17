namespace Domain;

public class AiScenarioTranslation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AiScenarioId { get; set; }
    public string Language { get; set; } = "en"; // "en" or "fa"
    public string Title { get; set; } = string.Empty;
    public string ClinicalContext { get; set; } = string.Empty;
    public string MethodologyDescription { get; set; } = string.Empty;
    public string ExpectedOutcome { get; set; } = string.Empty;
}
