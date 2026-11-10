using Domain;

namespace Application.QcProtocols.DTOs;

public class QcProtocolDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Standard { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ClinicalPurpose { get; set; } = string.Empty;
    public string AcquisitionParameters { get; set; } = string.Empty;

    public PhantomSpecDto? Phantom { get; set; }
    public List<TestStepDto> Steps { get; set; } = new();
    public List<AcceptanceCriterionDto> AcceptanceCriteria { get; set; } = new();
}

public class PhantomSpecDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string RecommendedIsotope { get; set; } = string.Empty;
    public string ActivityLevel { get; set; } = string.Empty;
    public string PreparationInstructions { get; set; } = string.Empty;
    public string Dimensions { get; set; } = string.Empty;
}

public class TestStepDto
{
    public Guid Id { get; set; }
    public int StepNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Instruction { get; set; } = string.Empty;
    public bool IsCritical { get; set; }
    public string? CautionNote { get; set; }
}

public class AcceptanceCriterionDto
{
    public Guid Id { get; set; }
    public string ParameterName { get; set; } = string.Empty;
    public string ComparisonOperator { get; set; } = string.Empty;
    public double TargetValue { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string ToleranceDescription { get; set; } = string.Empty;
    public string RemedialAction { get; set; } = string.Empty;
}
