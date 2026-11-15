import { LESSONS, getLesson, type LessonId } from "../lessons";

describe("lessons data", () => {
  const expectedLessonIds: LessonId[] = [
    "banking",
    "savings",
    "upi",
    "fraud",
    "borrowing",
    "help",
  ];

  it("contains exactly the 6 required lessons", () => {
    expect(LESSONS.map((l) => l.id)).toEqual(expectedLessonIds);
  });

  it("configures each lesson with icon and valid keyPrefix", () => {
    for (const lesson of LESSONS) {
      expect(lesson.icon.length).toBeGreaterThan(0);
      expect(lesson.keyPrefix).toBe(`lessons.${lesson.id}`);
    }
  });

  it("retrieves a lesson by id via getLesson", () => {
    const banking = getLesson("banking");
    expect(banking).toBeDefined();
    expect(banking?.id).toBe("banking");

    const unknown = getLesson("unknown-topic");
    expect(unknown).toBeUndefined();
  });
});

