import { QUIZZES, getQuiz } from "../quizzes";

describe("quizzes data", () => {
  it("defines core quiz with exactly 5 questions", () => {
    const core = QUIZZES.core;
    expect(core).toBeDefined();
    expect(core.id).toBe("core");
    expect(core.questions).toHaveLength(5);
  });

  it("ensures each question has optionCount >= 2 and valid correctIndex", () => {
    const core = QUIZZES.core;
    for (const q of core.questions) {
      expect(q.optionCount).toBeGreaterThanOrEqual(2);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.optionCount);
    }
  });

  it("retrieves a quiz by id via getQuiz", () => {
    const quiz = getQuiz("core");
    expect(quiz).toBeDefined();
    expect(quiz?.id).toBe("core");

    const missing = getQuiz("non-existent");
    expect(missing).toBeUndefined();
  });
});

