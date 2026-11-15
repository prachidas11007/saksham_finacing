export interface QuizQuestion {
  id: string;
  optionCount: number;
  correctIndex: number;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
}

export const QUIZZES: Record<string, Quiz> = {
  core: {
    id: "core",
    questions: [
      {
        id: "q1",
        optionCount: 3,
        correctIndex: 1,
      },
      {
        id: "q2",
        optionCount: 3,
        correctIndex: 0,
      },
      {
        id: "q3",
        optionCount: 3,
        correctIndex: 1,
      },
      {
        id: "q4",
        optionCount: 3,
        correctIndex: 2,
      },
      {
        id: "q5",
        optionCount: 3,
        correctIndex: 0,
      },
    ],
  },
};

export function getQuiz(id: string): Quiz | undefined {
  return QUIZZES[id];
}

