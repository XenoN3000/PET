namespace Domain;

public class AiScenario
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Code { get; set; } = string.Empty; // e.g. "PVC-RECOVERY", "LOW-DOSE-DENOISING"
    public double DefaultDoseReductionFactor { get; set; } = 4.0;
    public double DefaultLesionDiameterMm { get; set; } = 15.0;

    public ICollection<AiScenarioTranslation> Translations { get; set; } = new List<AiScenarioTranslation>();
}
