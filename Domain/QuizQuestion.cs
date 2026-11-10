namespace Domain;

public class QuizQuestion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QuizId { get; set; }
    public int Order { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string? ReferenceProtocol { get; set; }

    public ICollection<QuizOption> Options { get; set; } = new List<QuizOption>();
}
