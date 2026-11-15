import { act } from "react";
import { Alert, Linking } from "react-native";
import { createRoot } from "test-renderer";
import NetInfo from "@react-native-community/netinfo";
import { ExternalLinkButton } from "../ExternalLinkButton";
import { PreferencesProvider } from "../../context/PreferencesContext";
import { OFFICIAL_LINKS } from "../../data/officialLinks";
import "../../i18n";

jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("ExternalLinkButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows offline alert if network is not connected when pressed", async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
    });
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const link = OFFICIAL_LINKS.pmjdy;
    const renderer = createRoot();

    await act(async () => {
      renderer.render(
        <PreferencesProvider>
          <ExternalLinkButton link={link} />
        </PreferencesProvider>
      );
    });

    const pressable = renderer.container.children[0];
    expect(pressable).toBeDefined();

    await act(async () => {
      if (typeof pressable !== "string" && pressable) {
        if (typeof pressable.props.onClick === "function") {
          pressable.props.onClick({ preventDefault: () => {} });
        } else if (typeof pressable.props.onResponderRelease === "function") {
          pressable.props.onResponderRelease({});
        }
      }
    });

    expect(NetInfo.fetch).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith("Internet needed to open this link");
  });

  it("opens link in browser when online", async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
    });
    const openUrlSpy = jest
      .spyOn(Linking, "openURL")
      .mockResolvedValue(true as never);

    const link = OFFICIAL_LINKS.pmjdy;
    const renderer = createRoot();

    await act(async () => {
      renderer.render(
        <PreferencesProvider>
          <ExternalLinkButton link={link} />
        </PreferencesProvider>
      );
    });

    const pressable = renderer.container.children[0];
    expect(pressable).toBeDefined();

    await act(async () => {
      if (typeof pressable !== "string" && pressable) {
        if (typeof pressable.props.onClick === "function") {
          pressable.props.onClick({ preventDefault: () => {} });
        } else if (typeof pressable.props.onResponderRelease === "function") {
          pressable.props.onResponderRelease({});
        }
      }
    });

    expect(NetInfo.fetch).toHaveBeenCalled();
    expect(openUrlSpy).toHaveBeenCalledWith(link.url);
  });
});
