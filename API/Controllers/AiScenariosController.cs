using Application.AiScenarios.DTOs;
using Application.AiScenarios.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AiScenariosController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<AiScenarioDto>>> GetScenarios([FromQuery] string? lang)
    {
        var resolvedLang = GetCurrentLanguage(lang);
        return HandleResult(await Mediator.Send(new GetAiScenarios.Query { Lang = resolvedLang }));
    }
}
