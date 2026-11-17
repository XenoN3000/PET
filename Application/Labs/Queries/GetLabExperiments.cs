using Application.Core;
using Application.Labs.DTOs;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Labs.Queries;

public static class GetLabExperiments
{
    public class Query : IRequest<Result<List<LabExperimentDto>>>
    {
        public string? Lang { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<LabExperimentDto>>>
    {
        private readonly DatabaseContext _context;

        public Handler(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Result<List<LabExperimentDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var labs = await _context.LabExperiments
                .Include(l => l.Translations)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            var lang = string.IsNullOrWhiteSpace(request.Lang) ? "en" : request.Lang;
            var dtos = labs.Select(l =>
            {
                var trans = l.Translations.FirstOrDefault(t => t.Language.Equals(lang, StringComparison.OrdinalIgnoreCase))
                            ?? l.Translations.FirstOrDefault(t => t.Language.Equals("en", StringComparison.OrdinalIgnoreCase));

                return new LabExperimentDto
                {
                    Id = l.Id,
                    Slug = l.Slug,
                    Standard = l.Standard,
                    DefaultParametersJson = l.DefaultParametersJson,
                    Title = trans?.Title ?? l.Slug,
                    Subtitle = trans?.Subtitle ?? string.Empty,
                    Description = trans?.Description ?? string.Empty,
                    Instructions = trans?.Instructions ?? string.Empty
                };
            }).ToList();

            return Result<List<LabExperimentDto>>.Success(dtos);
        }
    }
}
