using AutoMapper;
using Domain;
using Application.QcProtocols.DTOs;
using Application.Quizzes.DTOs;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<QcProtocol, QcProtocolDto>()
            .ForMember(d => d.Frequency, o => o.MapFrom(s => s.Frequency.ToString()));
        CreateMap<PhantomSpec, PhantomSpecDto>();
        CreateMap<TestStep, TestStepDto>();
        CreateMap<AcceptanceCriterion, AcceptanceCriterionDto>();

        CreateMap<Quiz, QuizDto>()
            .ForMember(d => d.QuestionCount, o => o.MapFrom(s => s.Questions.Count));
        CreateMap<QuizQuestion, QuizQuestionDto>();
        CreateMap<QuizOption, QuizOptionDto>();
    }
}
