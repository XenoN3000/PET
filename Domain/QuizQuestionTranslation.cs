namespace Domain;

public class QuizQuestionTranslation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QuizQuestionId { get; set; }
    public string Language { get; set; } = "en"; // "en" or "fa"
    public string QuestionText { get; set; } = string.Empty;
    public string? ReferenceProtocol { get; set; }
}
