namespace Domain;

public class TestStepTranslation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TestStepId { get; set; }
    public string Language { get; set; } = "en"; // "en" or "fa"
    public string Title { get; set; } = string.Empty;
    public string Instruction { get; set; } = string.Empty;
    public string? CautionNote { get; set; }
}
