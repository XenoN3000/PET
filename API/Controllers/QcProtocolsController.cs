using Application.QcProtocols.DTOs;
using Application.QcProtocols.Queries;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class QcProtocolsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<QcProtocolDto>>> GetProtocols([FromQuery] QcFrequency? frequency, [FromQuery] string? lang)
    {
        var resolvedLang = GetCurrentLanguage(lang);
        return HandleResult(await Mediator.Send(new GetQcProtocols.Query 
        { 
            Frequency = frequency, 
            Lang = resolvedLang 
        }));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<QcProtocolDto>> GetProtocol(Guid id, [FromQuery] string? lang)
    {
        var resolvedLang = GetCurrentLanguage(lang);
        return HandleResult(await Mediator.Send(new GetQcProtocolById.Query 
        { 
            Id = id, 
            Lang = resolvedLang 
        }));
    }
}
