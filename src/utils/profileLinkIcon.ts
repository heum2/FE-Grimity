import type { IconName } from "@/components/common/Icon/Icon.types";

export const LINK_ICON_MAP: Record<string, IconName> = {
  인스타그램: "instagram",
  유튜브: "youtube",
  픽시브: "pixiv",
  X: "xtwitter",
  이메일: "email",
  "직접 입력": "link",
};

const LINK_LOGO_ICON_MAP: Partial<Record<IconName, IconName>> = {
  instagram: "instagram-fill",
  youtube: "youtube-fill",
  pixiv: "pixiv-fill",
  xtwitter: "xtwitter-fill",
};

export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

export function getLinkIconName(linkName: string): IconName {
  return LINK_ICON_MAP[linkName] || "link";
}

export function getLinkLogoIconName(linkName: string): IconName {
  const iconName = getLinkIconName(linkName);
  return LINK_LOGO_ICON_MAP[iconName] ?? iconName;
}

export function isEmailLink(link: string): boolean {
  return EMAIL_PATTERN.test(link);
}
