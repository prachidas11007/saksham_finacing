import { ACCESS_GUIDES, getAccessGuide, type AccessGuideId } from "../accessGuides";
import { OFFICIAL_LINKS } from "../officialLinks";

describe("accessGuides", () => {
  const expectedGuideIds: AccessGuideId[] = [
    "bank-account",
    "digital-payments",
    "borrowing",
    "savings-protection",
    "help",
  ];

  it("contains exactly the 5 specified guides", () => {
    expect(ACCESS_GUIDES.map((g) => g.id)).toEqual(expectedGuideIds);
  });

  it("configures each guide with icon, translationKeyPrefix, and valid linkIds", () => {
    for (const guide of ACCESS_GUIDES) {
      expect(guide.icon.length).toBeGreaterThan(0);
      expect(guide.translationKeyPrefix).toBe(`guides.${guide.id}`);
      expect(guide.keyPrefix).toBe(`guides.${guide.id}`);

      for (const linkId of guide.linkIds) {
        expect(OFFICIAL_LINKS[linkId]).toBeDefined();
      }
    }
  });

  it("routes help guide to /safety-help", () => {
    const helpGuide = getAccessGuide("help");
    expect(helpGuide).toBeDefined();
    expect(helpGuide?.route).toBe("/safety-help");
  });

  it("retrieves a guide by id via getAccessGuide", () => {
    const guide = getAccessGuide("bank-account");
    expect(guide).toBeDefined();
    expect(guide?.id).toBe("bank-account");

    const unknown = getAccessGuide("non-existent");
    expect(unknown).toBeUndefined();
  });
});

