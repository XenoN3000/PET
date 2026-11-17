using Application.Core;
using Application.QcProtocols.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.QcProtocols.Queries;

public static class GetQcProtocolById
{
    public class Query : IRequest<Result<QcProtocolDto>>
    {
        public Guid Id { get; set; }
        public string? Lang { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<QcProtocolDto>>
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public Handler(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<QcProtocolDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var protocol = await _context.QcProtocols
                .Include(p => p.Translations)
                .Include(p => p.Phantom)
                    .ThenInclude(ph => ph!.Translations)
                .Include(p => p.Steps.OrderBy(s => s.StepNumber))
                    .ThenInclude(s => s.Translations)
                .Include(p => p.AcceptanceCriteria)
                    .ThenInclude(a => a.Translations)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (protocol == null)
            {
                return Result<QcProtocolDto>.Failure("QC Protocol not found");
            }

            var dto = _mapper.Map<QcProtocolDto>(protocol);
            var lang = string.IsNullOrWhiteSpace(request.Lang) ? "en" : request.Lang;
            dto.Localize(protocol, lang);

            return Result<QcProtocolDto>.Success(dto);
        }
    }
}
