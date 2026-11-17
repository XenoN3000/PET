namespace Domain;

public class QuizOptionTranslation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QuizOptionId { get; set; }
    public string Language { get; set; } = "en"; // "en" or "fa"
    public string OptionText { get; set; } = string.Empty;
    public string ClinicalRationale { get; set; } = string.Empty;
}
