namespace Domain;

public class LabExperimentTranslation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LabExperimentId { get; set; }
    public string Language { get; set; } = "en"; // "en" or "fa"
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
}
