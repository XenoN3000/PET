namespace Domain;

public class QcProtocolTranslation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QcProtocolId { get; set; }
    public string Language { get; set; } = "en"; // "en" or "fa"
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ClinicalPurpose { get; set; } = string.Empty;
    public string AcquisitionParameters { get; set; } = string.Empty;
}
