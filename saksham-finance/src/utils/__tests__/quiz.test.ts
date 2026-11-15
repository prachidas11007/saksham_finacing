import { scoreQuiz } from '../quiz';

describe('scoreQuiz utility', () => {
  const correctAnswers = [0, 1, 2, 3, 4];

  it('scores 5/5 when all answers are correct', () => {
    const answers = [0, 1, 2, 3, 4];
    expect(scoreQuiz(answers, correctAnswers)).toEqual({
      score: 5,
      total: 5,
    });
  });

  it('scores 0/5 when none are correct', () => {
    const answers = [1, 2, 3, 4, 0];
    expect(scoreQuiz(answers, correctAnswers)).toEqual({
      score: 0,
      total: 5,
    });
  });

  it('counts unanswered/missing questions as wrong', () => {
    const answers = [0, null, 2, undefined, 4];
    expect(scoreQuiz(answers, correctAnswers)).toEqual({
      score: 3,
      total: 5,
    });
  });
});

