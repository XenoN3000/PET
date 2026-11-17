using Application.QcProtocols.DTOs;
using Application.Quizzes.DTOs;
using Domain;

namespace Application.Core;

public static class LocalizationExtensions
{
    public static void Localize(this QcProtocolDto dto, QcProtocol entity, string lang)
    {
        var trans = entity.Translations.FirstOrDefault(t => t.Language.Equals(lang, StringComparison.OrdinalIgnoreCase))
                    ?? entity.Translations.FirstOrDefault(t => t.Language.Equals("en", StringComparison.OrdinalIgnoreCase));
        if (trans != null)
        {
            if (!string.IsNullOrEmpty(trans.Title)) dto.Title = trans.Title;
            if (!string.IsNullOrEmpty(trans.Description)) dto.Description = trans.Description;
            if (!string.IsNullOrEmpty(trans.ClinicalPurpose)) dto.ClinicalPurpose = trans.ClinicalPurpose;
            if (!string.IsNullOrEmpty(trans.AcquisitionParameters)) dto.AcquisitionParameters = trans.AcquisitionParameters;
        }

        if (dto.Phantom != null && entity.Phantom != null)
        {
            var phTrans = entity.Phantom.Translations.FirstOrDefault(t => t.Language.Equals(lang, StringComparison.OrdinalIgnoreCase))
                          ?? entity.Phantom.Translations.FirstOrDefault(t => t.Language.Equals("en", StringComparison.OrdinalIgnoreCase));
            if (phTrans != null)
            {
                if (!string.IsNullOrEmpty(phTrans.Name)) dto.Phantom.Name = phTrans.Name;
                if (!string.IsNullOrEmpty(phTrans.Type)) dto.Phantom.Type = phTrans.Type;
                if (!string.IsNullOrEmpty(phTrans.RecommendedIsotope)) dto.Phantom.RecommendedIsotope = phTrans.RecommendedIsotope;
                if (!string.IsNullOrEmpty(phTrans.ActivityLevel)) dto.Phantom.ActivityLevel = phTrans.ActivityLevel;
                if (!string.IsNullOrEmpty(phTrans.PreparationInstructions)) dto.Phantom.PreparationInstructions = phTrans.PreparationInstructions;
                if (!string.IsNullOrEmpty(phTrans.Dimensions)) dto.Phantom.Dimensions = phTrans.Dimensions;
            }
        }

        foreach (var stepDto in dto.Steps)
        {
            var stepEntity = entity.Steps.FirstOrDefault(s => s.Id == stepDto.Id);
            if (stepEntity != null)
            {
                var sTrans = stepEntity.Translations.FirstOrDefault(t => t.Language.Equals(lang, StringComparison.OrdinalIgnoreCase))
                             ?? stepEntity.Translations.FirstOrDefault(t => t.Language.Equals("en", StringComparison.OrdinalIgnoreCase));
                if (sTrans != null)
                {
                    if (!string.IsNullOrEmpty(sTrans.Title)) stepDto.Title = sTrans.Title;
                    if (!string.IsNullOrEmpty(sTrans.Instruction)) stepDto.Instruction = sTrans.Instruction;
                    if (!string.IsNullOrEmpty(sTrans.CautionNote)) stepDto.CautionNote = sTrans.CautionNote;
                }
            }
        }

        foreach (var critDto in dto.AcceptanceCriteria)
        {
            var critEntity = entity.AcceptanceCriteria.FirstOrDefault(c => c.Id == critDto.Id);
            if (critEntity != null)
            {
                var cTrans = critEntity.Translations.FirstOrDefault(t => t.Language.Equals(lang, StringComparison.OrdinalIgnoreCase))
                             ?? critEntity.Translations.FirstOrDefault(t => t.Language.Equals("en", StringComparison.OrdinalIgnoreCase));
                if (cTrans != null)
                {
                    if (!string.IsNullOrEmpty(cTrans.ParameterName)) critDto.ParameterName = cTrans.ParameterName;
                    if (!string.IsNullOrEmpty(cTrans.ToleranceDescription)) critDto.ToleranceDescription = cTrans.ToleranceDescription;
                    if (!string.IsNullOrEmpty(cTrans.RemedialAction)) critDto.RemedialAction = cTrans.RemedialAction;
                }
            }
        }
    }

    public static void Localize(this QuizDto dto, Quiz entity, string lang)
    {
        var trans = entity.Translations.FirstOrDefault(t => t.Language.Equals(lang, StringComparison.OrdinalIgnoreCase))
                    ?? entity.Translations.FirstOrDefault(t => t.Language.Equals("en", StringComparison.OrdinalIgnoreCase));
        if (trans != null)
        {
            if (!string.IsNullOrEmpty(trans.Title)) dto.Title = trans.Title;
            if (!string.IsNullOrEmpty(trans.Description)) dto.Description = trans.Description;
            if (!string.IsNullOrEmpty(trans.Category)) dto.Category = trans.Category;
            if (!string.IsNullOrEmpty(trans.DifficultyLevel)) dto.DifficultyLevel = trans.DifficultyLevel;
        }

        foreach (var qDto in dto.Questions)
        {
            var qEntity = entity.Questions.FirstOrDefault(q => q.Id == qDto.Id);
            if (qEntity != null)
            {
                var qTrans = qEntity.Translations.FirstOrDefault(t => t.Language.Equals(lang, StringComparison.OrdinalIgnoreCase))
                             ?? qEntity.Translations.FirstOrDefault(t => t.Language.Equals("en", StringComparison.OrdinalIgnoreCase));
                if (qTrans != null)
                {
                    if (!string.IsNullOrEmpty(qTrans.QuestionText)) qDto.QuestionText = qTrans.QuestionText;
                    if (!string.IsNullOrEmpty(qTrans.ReferenceProtocol)) qDto.ReferenceProtocol = qTrans.ReferenceProtocol;
                }

                foreach (var oDto in qDto.Options)
                {
                    var oEntity = qEntity.Options.FirstOrDefault(o => o.Id == oDto.Id);
                    if (oEntity != null)
                    {
                        var oTrans = oEntity.Translations.FirstOrDefault(t => t.Language.Equals(lang, StringComparison.OrdinalIgnoreCase))
                                     ?? oEntity.Translations.FirstOrDefault(t => t.Language.Equals("en", StringComparison.OrdinalIgnoreCase));
                        if (oTrans != null)
                        {
                            if (!string.IsNullOrEmpty(oTrans.OptionText)) oDto.OptionText = oTrans.OptionText;
                            if (!string.IsNullOrEmpty(oTrans.ClinicalRationale)) oDto.ClinicalRationale = oTrans.ClinicalRationale;
                        }
                    }
                }
            }
        }
    }
}
