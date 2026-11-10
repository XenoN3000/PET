using Application.Quizzes.DTOs;
using Application.Quizzes.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class QuizzesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<QuizDto>>> GetQuizzes([FromQuery] string? category)
    {
        return HandleResult(await Mediator.Send(new GetQuizzes.Query { Category = category }));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<QuizDto>> GetQuiz(Guid id)
    {
        return HandleResult(await Mediator.Send(new GetQuizById.Query { Id = id }));
    }
}
