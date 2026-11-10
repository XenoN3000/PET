namespace Domain;

public class AcceptanceCriterion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QcProtocolId { get; set; }
    public string ParameterName { get; set; } = string.Empty;
    public string ComparisonOperator { get; set; } = string.Empty;
    public double TargetValue { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string ToleranceDescription { get; set; } = string.Empty;
    public string RemedialAction { get; set; } = string.Empty;
}
