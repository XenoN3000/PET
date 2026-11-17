using Application.Labs.DTOs;
using Application.Labs.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LabsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<LabExperimentDto>>> GetLabs([FromQuery] string? lang)
    {
        var resolvedLang = GetCurrentLanguage(lang);
        return HandleResult(await Mediator.Send(new GetLabExperiments.Query { Lang = resolvedLang }));
    }
}
