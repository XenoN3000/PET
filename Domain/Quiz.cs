namespace Domain;

public class Quiz
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string DifficultyLevel { get; set; } = "Intermediate";
    public int EstimatedMinutes { get; set; } = 10;

    public ICollection<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();
}
