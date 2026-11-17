using Application.AiScenarios.DTOs;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.AiScenarios.Queries;

public static class GetAiScenarios
{
    public class Query : IRequest<Result<List<AiScenarioDto>>>
    {
        public string? Lang { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<AiScenarioDto>>>
    {
        private readonly DatabaseContext _context;

        public Handler(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Result<List<AiScenarioDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var scenarios = await _context.AiScenarios
                .Include(s => s.Translations)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            var lang = string.IsNullOrWhiteSpace(request.Lang) ? "en" : request.Lang;
            var dtos = scenarios.Select(s =>
            {
                var trans = s.Translations.FirstOrDefault(t => t.Language.Equals(lang, StringComparison.OrdinalIgnoreCase))
                            ?? s.Translations.FirstOrDefault(t => t.Language.Equals("en", StringComparison.OrdinalIgnoreCase));

                return new AiScenarioDto
                {
                    Id = s.Id,
                    Code = s.Code,
                    DefaultDoseReductionFactor = s.DefaultDoseReductionFactor,
                    DefaultLesionDiameterMm = s.DefaultLesionDiameterMm,
                    Title = trans?.Title ?? s.Code,
                    ClinicalContext = trans?.ClinicalContext ?? string.Empty,
                    MethodologyDescription = trans?.MethodologyDescription ?? string.Empty,
                    ExpectedOutcome = trans?.ExpectedOutcome ?? string.Empty
                };
            }).ToList();

            return Result<List<AiScenarioDto>>.Success(dtos);
        }
    }
}
