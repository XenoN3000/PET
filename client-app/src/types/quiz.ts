export interface QuizOptionDto {
  id: string;
  quizQuestionId: string;
  optionText: string;
  isCorrect: boolean;
  clinicalRationale: string;
}

export interface QuizQuestionDto {
  id: string;
  quizId: string;
  order: number;
  questionText: string;
  referenceProtocol?: string | null;
  options: QuizOptionDto[];
}

export interface QuizDto {
  id: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  estimatedMinutes: number;
  questionCount: number;
  questions: QuizQuestionDto[];
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface QuizSummary {
  quizId: string;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  passed: boolean;
}
