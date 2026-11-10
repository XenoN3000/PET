import React, { useState } from 'react';
import type { QuizDto } from '../../types/quiz';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Award, 
  BookOpen, 
  Info, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface QuizRunnerProps {
  quiz: QuizDto;
  onExit: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ quiz, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const questions = quiz.questions;
  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (questionId: string, optionId: string) => {
    // If already answered this question, don't allow changing in real-time quiz mode
    if (selectedAnswers[questionId]) return;

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
    setIsReviewMode(false);
  };

  // Calculate score
  const correctCount = questions.reduce((acc, q) => {
    const selectedOptId = selectedAnswers[q.id];
    const correctOpt = q.options.find(o => o.isCorrect);
    return selectedOptId && correctOpt && selectedOptId === correctOpt.id ? acc + 1 : acc;
  }, 0);

  const scorePercentage = Math.round((correctCount / questions.length) * 100);
  const isPassed = scorePercentage >= 75;

  if (isCompleted && !isReviewMode) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-2">
            <Award className="w-12 h-12" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Assessment Complete!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            You have completed the <span className="font-semibold text-slate-800 dark:text-slate-200">{quiz.title}</span> training module.
          </p>

          {/* Score Badge */}
          <div className="py-6">
            <div className={`inline-block px-8 py-4 rounded-2xl border ${
              isPassed 
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' 
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
            }`}>
              <div className="text-4xl font-extrabold">{scorePercentage}%</div>
              <div className="text-xs uppercase tracking-wider font-semibold mt-1">
                {isPassed ? 'Clinical Proficiency Pass' : 'Review Recommended'}
              </div>
            </div>
          </div>

          {/* Breakdown stats */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-left border border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Questions</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{questions.length}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Correct Answers</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Incorrect</div>
              <div className="text-lg font-bold text-rose-600 dark:text-rose-400">{questions.length - correctCount}</div>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isPassed 
              ? 'Excellent work! You demonstrated solid mastery of standard PET tolerances and remediation procedures.' 
              : 'Consider reviewing the protocol specifications and running the interactive simulations in the Labs tab.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => setIsReviewMode(true)}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Review Answers & Rationales
            </button>
            <button
              onClick={handleRestart}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            >
              All Quizzes
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Review Mode: lists all questions and rationales in one clean view
  if (isReviewMode) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsReviewMode(false)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Summary
          </button>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            Review Mode ({correctCount}/{questions.length} Correct)
          </span>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userChoiceId = selectedAnswers[q.id];
            const correctOpt = q.options.find(o => o.isCorrect);
            const userChoice = q.options.find(o => o.id === userChoiceId);
            const isUserCorrect = userChoiceId === correctOpt?.id;

            return (
              <div 
                key={q.id} 
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {q.referenceProtocol || 'PET Clinical Protocol'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {isUserCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {q.questionText}
                </p>

                <div className="space-y-2 pt-1">
                  {q.options.map(opt => {
                    const isSelected = opt.id === userChoiceId;
                    const isCorrectAnswer = opt.isCorrect;

                    let optStyle = 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30';
                    if (isCorrectAnswer) {
                      optStyle = 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
                    } else if (isSelected && !isCorrectAnswer) {
                      optStyle = 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-lg border text-xs flex items-center justify-between ${optStyle}`}
                      >
                        <span className="flex-1">{opt.optionText}</span>
                        {isCorrectAnswer && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider ml-2 shrink-0">
                            Correct Answer
                          </span>
                        )}
                        {isSelected && !isCorrectAnswer && (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider ml-2 shrink-0">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold">Clinical Rationale: </span>
                    {userChoice ? userChoice.clinicalRationale : correctOpt?.clinicalRationale}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Question Runner Mode
  const selectedOptId = selectedAnswers[currentQuestion.id];
  const hasAnsweredCurrent = Boolean(selectedOptId);
  const selectedOptionObj = currentQuestion.options.find(o => o.id === selectedOptId);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit Quiz
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {quiz.category}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            Question {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div>
          {currentQuestion.referenceProtocol && (
            <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {currentQuestion.referenceProtocol}
            </div>
          )}
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {currentQuestion.questionText}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedOptId === opt.id;
            const isCorrect = opt.isCorrect;

            let buttonStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200';
            
            if (hasAnsweredCurrent) {
              if (isCorrect) {
                buttonStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 font-medium shadow-sm';
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 font-medium shadow-sm';
              } else {
                buttonStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                disabled={hasAnsweredCurrent}
                className={`w-full text-left p-4 rounded-xl border text-sm flex items-start justify-between gap-3 transition-all ${buttonStyle}`}
              >
                <span className="flex-1 leading-relaxed">{opt.optionText}</span>
                {hasAnsweredCurrent && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                )}
                {hasAnsweredCurrent && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Rationale Feedback Box */}
        {hasAnsweredCurrent && selectedOptionObj && (
          <div className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-start gap-3 ${
            selectedOptionObj.isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
          }`}>
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold mb-1">
                {selectedOptionObj.isCorrect ? 'Correct Diagnosis!' : 'Review Clinical Rationale:'}
              </div>
              <p>{selectedOptionObj.clinicalRationale}</p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!hasAnsweredCurrent}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {currentIndex === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
