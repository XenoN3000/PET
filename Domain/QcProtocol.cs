namespace Domain;

public class QcProtocol
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Standard { get; set; } = string.Empty;
    public QcFrequency Frequency { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ClinicalPurpose { get; set; } = string.Empty;
    public string AcquisitionParameters { get; set; } = string.Empty;

    public PhantomSpec? Phantom { get; set; }
    public ICollection<TestStep> Steps { get; set; } = new List<TestStep>();
    public ICollection<AcceptanceCriterion> AcceptanceCriteria { get; set; } = new List<AcceptanceCriterion>();
}
