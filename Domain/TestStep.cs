namespace Domain;

public class TestStep
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QcProtocolId { get; set; }
    public int StepNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Instruction { get; set; } = string.Empty;
    public bool IsCritical { get; set; }
    public string? CautionNote { get; set; }
}
