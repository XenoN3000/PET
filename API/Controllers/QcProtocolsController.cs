using Application.QcProtocols.DTOs;
using Application.QcProtocols.Queries;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class QcProtocolsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<QcProtocolDto>>> GetProtocols([FromQuery] QcFrequency? frequency)
    {
        return HandleResult(await Mediator.Send(new GetQcProtocols.Query { Frequency = frequency }));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<QcProtocolDto>> GetProtocol(Guid id)
    {
        return HandleResult(await Mediator.Send(new GetQcProtocolById.Query { Id = id }));
    }
}
