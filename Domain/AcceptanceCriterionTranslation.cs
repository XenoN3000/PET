namespace Domain;

public class AcceptanceCriterionTranslation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AcceptanceCriterionId { get; set; }
    public string Language { get; set; } = "en"; // "en" or "fa"
    public string ParameterName { get; set; } = string.Empty;
    public string ToleranceDescription { get; set; } = string.Empty;
    public string RemedialAction { get; set; } = string.Empty;
}
