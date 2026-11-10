using Application.Core;
using Application.QcProtocols.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.QcProtocols.Queries;

public static class GetQcProtocols
{
    public class Query : IRequest<Result<List<QcProtocolDto>>>
    {
        public QcFrequency? Frequency { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<QcProtocolDto>>>
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public Handler(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<List<QcProtocolDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.QcProtocols
                .Include(p => p.Phantom)
                .Include(p => p.Steps.OrderBy(s => s.StepNumber))
                .Include(p => p.AcceptanceCriteria)
                .AsNoTracking();

            if (request.Frequency.HasValue)
            {
                query = query.Where(p => p.Frequency == request.Frequency.Value);
            }

            var protocols = await query.ToListAsync(cancellationToken);
            var dtos = _mapper.Map<List<QcProtocolDto>>(protocols);

            return Result<List<QcProtocolDto>>.Success(dtos);
        }
    }
}
