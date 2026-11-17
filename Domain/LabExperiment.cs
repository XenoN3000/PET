namespace Domain;

public class LabExperiment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Slug { get; set; } = string.Empty; // e.g. "spatial-resolution", "daily-uniformity"
    public string Standard { get; set; } = string.Empty;
    public string DefaultParametersJson { get; set; } = "{}";

    public ICollection<LabExperimentTranslation> Translations { get; set; } = new List<LabExperimentTranslation>();
}
