import type { QuizScoreResult } from '../data/types';

export function scoreQuiz(
  answers: (number | null | undefined)[],
  correctIndexes: number[],
): QuizScoreResult {
  const total = correctIndexes.length;
  let score = 0;

  for (let i = 0; i < total; i++) {
    const answer = answers[i];
    if (
      answer !== null &&
      answer !== undefined &&
      answer === correctIndexes[i]
    ) {
      score++;
    }
  }

  return {
    score,
    total,
  };
}

