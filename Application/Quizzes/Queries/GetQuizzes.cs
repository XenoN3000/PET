using Application.Core;
using Application.Quizzes.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Quizzes.Queries;

public static class GetQuizzes
{
    public class Query : IRequest<Result<List<QuizDto>>>
    {
        public string? Category { get; set; }
        public string? Lang { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<QuizDto>>>
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public Handler(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<List<QuizDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.Quizzes
                .Include(q => q.Translations)
                .Include(q => q.Questions)
                    .ThenInclude(qu => qu.Translations)
                .Include(q => q.Questions)
                    .ThenInclude(qu => qu.Options)
                        .ThenInclude(o => o.Translations)
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(request.Category))
            {
                query = query.Where(q => q.Category == request.Category);
            }

            var quizzes = await query.ToListAsync(cancellationToken);
            var dtos = _mapper.Map<List<QuizDto>>(quizzes);

            var lang = string.IsNullOrWhiteSpace(request.Lang) ? "en" : request.Lang;
            for (int i = 0; i < dtos.Count; i++)
            {
                dtos[i].Localize(quizzes[i], lang);
            }

            return Result<List<QuizDto>>.Success(dtos);
        }
    }
}
