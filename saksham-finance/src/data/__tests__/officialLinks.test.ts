import {
  CYBER_HELPLINE,
  OFFICIAL_LINKS,
  OFFICIAL_LINKS_LIST,
  getOfficialLink,
  type OfficialLinkId,
} from "../officialLinks";

describe("officialLinks", () => {
  it("defines the verified national cybercrime helpline as 1930", () => {
    expect(CYBER_HELPLINE).toBe("1930");
  });

  const expectedIds: OfficialLinkId[] = [
    "pmjdy",
    "rbiEducation",
    "rbiFame",
    "npciFraud",
    "npciUpiFaq",
    "cybercrime",
    "rbiComplaints",
    "rbiCms",
    "janSuraksha",
  ];

  it("contains exactly the 9 approved official links with lastReviewedAt 2026-11-13", () => {
    expect(Object.keys(OFFICIAL_LINKS).sort()).toEqual(expectedIds.slice().sort());
    expect(OFFICIAL_LINKS_LIST.length).toBe(9);

    for (const id of expectedIds) {
      const link = OFFICIAL_LINKS[id];
      expect(link).toBeDefined();
      expect(link.id).toBe(id);
      expect(link.lastReviewedAt).toBe("2026-11-13");
      expect(link.url.length).toBeGreaterThan(0);
      expect(link.labelKey).toBe(`officialLinks.${id}`);
    }
  });

  it("retrieves a link by id via getOfficialLink", () => {
    const pmjdy = getOfficialLink("pmjdy");
    expect(pmjdy.id).toBe("pmjdy");
    expect(pmjdy.url).toBe(OFFICIAL_LINKS.pmjdy.url);
  });
});
