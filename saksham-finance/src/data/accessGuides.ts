import type { Ionicons } from "@expo/vector-icons";
import type { OfficialLinkId } from "./officialLinks";

export type AccessGuideId =
  | "bank-account"
  | "digital-payments"
  | "borrowing"
  | "savings-protection"
  | "help";

export interface AccessGuide {
  id: AccessGuideId;
  icon: keyof typeof Ionicons.glyphMap;
  translationKeyPrefix: string;
  keyPrefix: string;
  linkIds: OfficialLinkId[];
  route?: string;
}

export const ACCESS_GUIDES: AccessGuide[] = [
  {
    id: "bank-account",
    icon: "business",
    translationKeyPrefix: "guides.bank-account",
    keyPrefix: "guides.bank-account",
    linkIds: ["pmjdy", "rbiEducation"],
  },
  {
    id: "digital-payments",
    icon: "phone-portrait",
    translationKeyPrefix: "guides.digital-payments",
    keyPrefix: "guides.digital-payments",
    linkIds: ["npciFraud", "npciUpiFaq"],
  },
  {
    id: "borrowing",
    icon: "calculator",
    translationKeyPrefix: "guides.borrowing",
    keyPrefix: "guides.borrowing",
    linkIds: ["rbiEducation", "rbiFame"],
  },
  {
    id: "savings-protection",
    icon: "shield-checkmark",
    translationKeyPrefix: "guides.savings-protection",
    keyPrefix: "guides.savings-protection",
    linkIds: ["janSuraksha"],
  },
  {
    id: "help",
    icon: "alert-circle",
    translationKeyPrefix: "guides.help",
    keyPrefix: "guides.help",
    linkIds: ["cybercrime", "rbiComplaints", "rbiCms"],
    route: "/safety-help",
  },
];

export function getAccessGuide(id: string): AccessGuide | undefined {
  return ACCESS_GUIDES.find((g) => g.id === id);
}

