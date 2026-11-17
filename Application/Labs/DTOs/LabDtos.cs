namespace Application.Labs.DTOs;

public class LabExperimentDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Standard { get; set; } = string.Empty;
    public string DefaultParametersJson { get; set; } = "{}";
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
}
