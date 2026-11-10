using Domain;

namespace Application.Quizzes.DTOs;

public class QuizDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string DifficultyLevel { get; set; } = string.Empty;
    public int EstimatedMinutes { get; set; }
    public int QuestionCount { get; set; }
    public List<QuizQuestionDto> Questions { get; set; } = new();
}

public class QuizQuestionDto
{
    public Guid Id { get; set; }
    public Guid QuizId { get; set; }
    public int Order { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string? ReferenceProtocol { get; set; }
    public List<QuizOptionDto> Options { get; set; } = new();
}

public class QuizOptionDto
{
    public Guid Id { get; set; }
    public Guid QuizQuestionId { get; set; }
    public string OptionText { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public string ClinicalRationale { get; set; } = string.Empty;
}
