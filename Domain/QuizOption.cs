namespace Domain;

public class QuizOption
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QuizQuestionId { get; set; }
    public string OptionText { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public string ClinicalRationale { get; set; } = string.Empty;
}
