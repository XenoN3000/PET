using Application.Core;
using Application.Quizzes.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Quizzes.Queries;

public static class GetQuizById
{
    public class Query : IRequest<Result<QuizDto>>
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<QuizDto>>
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public Handler(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<QuizDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions.OrderBy(x => x.Order))
                    .ThenInclude(qu => qu.Options)
                .AsNoTracking()
                .FirstOrDefaultAsync(q => q.Id == request.Id, cancellationToken);

            if (quiz == null)
            {
                return Result<QuizDto>.Failure($"Quiz with ID {request.Id} not found");
            }

            var dto = _mapper.Map<QuizDto>(quiz);
            return Result<QuizDto>.Success(dto);
        }
    }
}
