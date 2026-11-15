import i18n, { tList } from "../index";

describe("i18n", () => {
  it("initializes synchronously with fallback language en", () => {
    expect(i18n.isInitialized).toBe(true);
    expect(i18n.language).toBe("en");
  });

  it("translates common keys", () => {
    expect(i18n.t("common.appName")).toBe("Saksham");
    expect(i18n.t("common.save")).toBe("Save");
  });

  it("changes language to hi and mr", async () => {
    await i18n.changeLanguage("hi");
    expect(i18n.t("common.appName")).toBe("सक्षम");
    expect(i18n.t("common.save")).toBe("सहेजें");

    await i18n.changeLanguage("mr");
    expect(i18n.t("common.appName")).toBe("सक्षम");
    expect(i18n.t("common.save")).toBe("जतन करा");

    await i18n.changeLanguage("en");
    expect(i18n.t("common.appName")).toBe("Saksham");
  });

  it("tList returns an empty array for non-array keys", () => {
    const list = tList("common.appName");
    expect(Array.isArray(list)).toBe(true);
    expect(list).toEqual([]);
  });
});

