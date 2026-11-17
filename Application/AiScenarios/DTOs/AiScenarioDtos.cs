namespace Application.AiScenarios.DTOs;

public class AiScenarioDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public double DefaultDoseReductionFactor { get; set; }
    public double DefaultLesionDiameterMm { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ClinicalContext { get; set; } = string.Empty;
    public string MethodologyDescription { get; set; } = string.Empty;
    public string ExpectedOutcome { get; set; } = string.Empty;
}
